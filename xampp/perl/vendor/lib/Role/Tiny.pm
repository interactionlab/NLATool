package Role::Tiny;

sub _getglob { \*{$_[0]} }
sub _getstash { \%{"$_[0]::"} }

use strict;
use warnings FATAL => 'all';

our $VERSION = '1.002005'; # 1.2.5
$VERSION = eval $VERSION;

our %INFO;
our %APPLIED_TO;
our %COMPOSED;
our %COMPOSITE_INFO;

# Module state workaround totally stolen from Zefram's Module::Runtime.

BEGIN {
  *_WORK_AROUND_BROKEN_MODULE_STATE = "$]" < 5.009 ? sub(){1} : sub(){0};
}

sub Role::Tiny::__GUARD__::DESTROY {
  delete $INC{$_[0]->[0]} if @{$_[0]};
}

sub _load_module {
  (my $proto = $_[0]) =~ s/::/\//g;
  $proto .= '.pm';
  return 1 if $INC{$proto};
  # can't just ->can('can') because a sub-package Foo::Bar::Baz
  # creates a 'Baz::' key in Foo::Bar's symbol table
  return 1 if grep !/::$/, keys %{_getstash($_[0])||{}};
  my $guard = _WORK_AROUND_BROKEN_MODULE_STATE
    && bless([ $proto ], 'Role::Tiny::__GUARD__');
  require $proto;
  pop @$guard if _WORK_AROUND_BROKEN_MODULE_STATE;
  return 1;
}

sub import {
  my $target = caller;
  my $me = shift;
  strict->import;
  warnings->import(FATAL => 'all');
  return if $INFO{$target}; # already exported into this package
  # get symbol table reference
  my $stash = _getstash($target);
  # install before/after/around subs
  foreach my $type (qw(before after around)) {
    *{_getglob "${target}::${type}"} = sub {
      require Class::Method::Modifiers;
      push @{$INFO{$target}{modifiers}||=[]}, [ $type => @_ ];
      return;
    };
  }
  *{_getglob "${target}::requires"} = sub {
    push @{$INFO{$target}{requires}||=[]}, @_;
    return;
  };
  *{_getglob "${target}::with"} = sub {
    $me->apply_roles_to_package($target, @_);
    return;
  };
  # grab all *non-constant* (stash slot is not a scalarref) subs present
  # in the symbol table and store their refaddrs (no need to forcibly
  # inflate constant subs into real subs) - also add '' to here (this
  # is used later) with a map to the coderefs in case of copying or re-use
  my @not_methods = ('', map { *$_{CODE}||() } grep !ref($_), values %$stash);
  @{$INFO{$target}{not_methods}={}}{@not_methods} = @not_methods;
  # a role does itself
  $APPLIED_TO{$target} = { $target => undef };
}

sub apply_single_role_to_package {
  my ($me, $to, $role) = @_;

  _load_module($role);

  die "This is apply_role_to_package" if ref($to);
  die "${role} is not a Role::Tiny" unless my $info = $INFO{$role};

  $me->_check_requires($to, $role, @{$info->{requires}||[]});

  $me->_install_methods($to, $role);

  $me->_install_modifiers($to, $info->{modifiers});

  # copy our role list into the target's
  @{$APPLIED_TO{$to}||={}}{keys %{$APPLIED_TO{$role}}} = ();
}

sub apply_roles_to_object {
  my ($me, $object, @roles) = @_;
  die "No roles supplied!" unless @roles;
  my $class = ref($object);
  bless($object, $me->create_class_with_roles($class, @roles));
  $object;
}

sub create_class_with_roles {
  my ($me, $superclass, @roles) = @_;

  die "No roles supplied!" unless @roles;

  _load_module($superclass);
  {
    my %seen;
    $seen{$_}++ for @roles;
    if (my @dupes = grep $seen{$_} > 1, @roles) {
      die "Duplicated roles: ".join(', ', @dupes);
    }
  }

  my $new_name = join(
    '__WITH__', $superclass, my $compose_name = join '__AND__', @roles
  );

  return $new_name if $COMPOSED{class}{$new_name};

  foreach my $role (@roles) {
    _load_module($role);
    die "${role} is not a Role::Tiny" unless $INFO{$role};
  }

  if ($] >= 5.010) {
    require mro;
  } else {
    require MRO::Compat;
  }

  my %conflicts = %{$me->_composite_info_for(@roles)->{conflicts}};
  if (keys %conflicts) {
    my $fail = 
      join "\n",
        map {
          "Method name conflict for '$_' between roles "
          ."'".join(' and ', sort values %{$conflicts{$_}})."'"
          .", cannot apply these simultaneously to an object."
        } keys %conflicts;
    die $fail;
  }

  my @composable = map $me->_composable_package_for($_), reverse @roles;

  *{_getglob("${new_name}::ISA")} = [ @composable, $superclass ];

  my @info = map $INFO{$_}, @roles;

  $me->_check_requires(
    $new_name, $compose_name,
    do { my %h; @h{map @{$_->{requires}||[]}, @info} = (); keys %h }
  );

  @{$APPLIED_TO{$new_name}||={}}{
    map keys %{$APPLIED_TO{$_}}, @roles
  } = ();

  $COMPOSED{class}{$new_name} = 1;
  return $new_name;
}

# preserved for compat, and apply_roles_to_package calls it to allow an
# updated Role::Tiny to use a non-updated Moo::Role

sub apply_role_to_package { shift->apply_single_role_to_package(@_) }

sub apply_roles_to_package {
  my ($me, $to, @roles) = @_;

  return $me->apply_role_to_package($to, $roles[0]) if @roles == 1;

  my %conflicts = %{$me->_composite_info_for(@roles)->{conflicts}};
  delete $conflicts{$_} for $me->_concrete_methods_of($to);
  if (keys %conflicts) {
    my $fail = 
      join "\n",
        map {
          "Due to a method name conflict between roles "
          ."'".join(' and ', sort values %{$conflicts{$_}})."'"
          .", the method '$_' must be implemented by '${to}'"
        } keys %conflicts;
    die $fail;
  }

  # the if guard here is essential since otherwise we accidentally create
  # a $INFO for something that isn't a Role::Tiny (or Moo::Role) because
  # autovivification hates us and wants us to die()
  if ($INFO{$to}) {
    delete $INFO{$to}{methods}; # reset since we're about to add methods
  }

  foreach my $role (@roles) {
    $me->apply_single_role_to_package($to, $role);
  }
  $APPLIED_TO{$to}{join('|',@roles)} = 1;
}

sub _composite_info_for {
  my ($me, @roles) = @_;
  $COMPOSITE_INFO{join('|', sort @roles)} ||= do {
    foreach my $role (@roles) {
      _load_module($role);
    }
    my %methods;
    foreach my $role (@roles) {
      my $this_methods = $me->_concrete_methods_of($role);
      $methods{$_}{$this_methods->{$_}} = $role for keys %$this_methods;
    }
    delete $methods{$_} for grep keys(%{$methods{$_}}) == 1, keys %methods;
    +{ conflicts => \%methods }
  };
}

sub _composable_package_for {
  my ($me, $role) = @_;
  my $composed_name = 'Role::Tiny::_COMPOSABLE::'.$role;
  return $composed_name if $COMPOSED{role}{$composed_name};
  $me->_install_methods($composed_name, $role);
  my $base_name = $composed_name.'::_BASE';
  # Not using _getglob, since setting @ISA via the typeglob breaks
  # inheritance on 5.10.0 if the stash has previously been accessed an
  # then a method called on the class (in that order!), which
  # ->_install_methods (with the help of ->_install_does) ends up doing.
  { no strict 'refs'; @{"${composed_name}::ISA"} = ( $base_name ); }
  my $modifiers = $INFO{$role}{modifiers}||[];
  my @mod_base;
  foreach my $modified (
    do { my %h; @h{map $_->[1], @$modifiers} = (); keys %h }
  ) {
    push @mod_base, "sub ${modified} { shift->next::method(\@_) }";
  }
  my $e;
  {
    local $@;
    eval(my $code = join "\n", "package ${base_name};", @mod_base);
    $e = "Evaling failed: $@\nTrying to eval:\n${code}" if $@;
  }
  die $e if $e;
  $me->_install_modifiers($composed_name, $modifiers);
  $COMPOSED{role}{$composed_name} = 1;
  return $composed_name;
}

sub _check_requires {
  my ($me, $to, $name, @requires) = @_;
  if (my @requires_fail = grep !$to->can($_), @requires) {
    # role -> role, add to requires, role -> class, error out
    if (my $to_info = $INFO{$to}) {
      push @{$to_info->{requires}||=[]}, @requires_fail;
    } else {
      die "Can't apply ${name} to ${to} - missing ".join(', ', @requires_fail);
    }
  }
}

sub _concrete_methods_of {
  my ($me, $role) = @_;
  my $info = $INFO{$role};
  # grab role symbol table
  my $stash = _getstash($role);
  # reverse so our keys become the values (captured coderefs) in case
  # they got copied or re-used since
  my $not_methods = { reverse %{$info->{not_methods}||{}} };
  $info->{methods} ||= +{
    # grab all code entries that aren't in the not_methods list
    map {
      my $code = *{$stash->{$_}}{CODE};
      # rely on the '' key we added in import for "no code here"
      exists $not_methods->{$code||''} ? () : ($_ => $code)
    } grep !ref($stash->{$_}), keys %$stash
  };
}

sub methods_provided_by {
  my ($me, $role) = @_;
  die "${role} is not a Role::Tiny" unless my $info = $INFO{$role};
  (keys %{$me->_concrete_methods_of($role)}, @{$info->{requires}||[]});
}

sub _install_methods {
  my ($me, $to, $role) = @_;

  my $info = $INFO{$role};

  my $methods = $me->_concrete_methods_of($role);

  # grab target symbol table
  my $stash = _getstash($to);

  # determine already extant methods of target
  my %has_methods;
  @has_methods{grep
    +(ref($stash->{$_}) || *{$stash->{$_}}{CODE}),
    keys %$stash
  } = ();

  foreach my $i (grep !exists $has_methods{$_}, keys %$methods) {
    no warnings 'once';
    *{_getglob "${to}::${i}"} = $methods->{$i};
  }
  
  $me->_install_does($to);
}

sub _install_modifiers {
  my ($me, $to, $modifiers) = @_;
  if (my $info = $INFO{$to}) {
    push @{$info->{modifiers}}, @{$modifiers||[]};
  } else {
    foreach my $modifier (@{$modifiers||[]}) {
      $me->_install_single_modifier($to, @$modifier);
    }
  }
}

my $vcheck_error;

sub _install_single_modifier {
  my ($me, @args) = @_;
  defined($vcheck_error) or $vcheck_error = do {
    local $@;
    eval { Class::Method::Modifiers->VERSION(1.05); 1 }
      ? 0
      : $@
  };
  $vcheck_error and die $vcheck_error;
  Class::Method::Modifiers::install_modifier(@args);
}

my $FALLBACK = sub { 0 };
sub _install_does {
  my ($me, $to) = @_;
  
  # only add does() method to classes
  return if $INFO{$to};
  
  # add does() only if they don't have one
  *{_getglob "${to}::does"} = \&does_role unless $to->can('does');
  
  return if ($to->can('DOES') and $to->can('DOES') != (UNIVERSAL->can('DOES') || 0));
  
  my $existing = $to->can('DOES') || $to->can('isa') || $FALLBACK;
  my $new_sub = sub {
    my ($proto, $role) = @_;
    Role::Tiny::does_role($proto, $role) or $proto->$existing($role);
  };
  no warnings 'redefine';
  *{_getglob "${to}::DOES"} = $new_sub;
}

sub does_role {
  my ($proto, $role) = @_;
  if ($] >= 5.010) {
    require mro;
  } else {
    require MRO::Compat;
  }
  foreach my $class (@{mro::get_linear_isa(ref($proto)||$proto)}) {
    return 1 if exists $APPLIED_TO{$class}{$role};
  }
  return 0;
}

1;

=head1 NAME

Role::Tiny - Roles. Like a nouvelle cuisine portion size slice of Moose.

=head1 SYNOPSIS

 package Some::Role;

 use Role::Tiny;

 sub foo { ... }

 sub bar { ... }

 around baz => sub { ... }

 1;

else where

 package Some::Class;

 use Role::Tiny::With;

 # bar gets imported, but not foo
 with 'Some::Role';

 sub foo { ... }

 # baz is wrapped in the around modifier by Class::Method::Modifiers
 sub baz { ... }

 1;

If you wanted attributes as well, look at L<Moo::Role>.

=head1 DESCRIPTION

C<Role::Tiny> is a minimalist role composition tool.

=head1 ROLE COMPOSITION

Role composition can be thought of as much more clever and meaningful multiple
inheritance.  The basics of this implementation of roles is:

=over 2

=item *

If a method is already defined on a class, that method will not be composed in
from the role.

=item *

If a method that the role L</requires> to be implemented is not implemented,
role application will fail loudly.

=back

Unlike L<Class::C3>, where the B<last> class inherited from "wins," role
composition is the other way around, where the class wins. If multiple roles
are applied in a single call (single with statement), then if any of their
provided methods clash, an exception is raised unless the class provides
a method since this conflict indicates a potential problem.

=head1 IMPORTED SUBROUTINES

=head2 requires

 requires qw(foo bar);

Declares a list of methods that must be defined to compose role.

=head2 with

 with 'Some::Role1';

 with 'Some::Role1', 'Some::Role2';

Composes another role into the current role (or class via L<Role::Tiny::With>).

If you have conflicts and want to resolve them in favour of Some::Role1 you
can instead write: 

 with 'Some::Role1';
 with 'Some::Role2';

If you have conflicts and want to resolve different conflicts in favour of
different roles, please refactor your codebase.

=head2 before

 before foo => sub { ... };

See L<< Class::Method::Modifiers/before method(s) => sub { ... } >> for full
documentation.

Note that since you are not required to use method modifiers,
L<Class::Method::Modifiers> is lazily loaded and we do not declare it as
a dependency. If your L<Role::Tiny> role uses modifiers you must depend on
both L<Class::Method::Modifiers> and L<Role::Tiny>.

=head2 around

 around foo => sub { ... };

See L<< Class::Method::Modifiers/around method(s) => sub { ... } >> for full
documentation.

Note that since you are not required to use method modifiers,
L<Class::Method::Modifiers> is lazily loaded and we do not declare it as
a dependency. If your L<Role::Tiny> role uses modifiers you must depend on
both L<Class::Method::Modifiers> and L<Role::Tiny>.

=head2 after

 after foo => sub { ... };

See L<< Class::Method::Modifiers/after method(s) => sub { ... } >> for full
documentation.

Note that since you are not required to use method modifiers,
L<Class::Method::Modifiers> is lazily loaded and we do not declare it as
a dependency. If your L<Role::Tiny> role uses modifiers you must depend on
both L<Class::Method::Modifiers> and L<Role::Tiny>.

=head1 SUBROUTINES

=head2 does_role

 if (Role::Tiny::does_role($foo, 'Some::Role')) {
   ...
 }

Returns true if class has been composed with role.

This subroutine is also installed as ->does on any class a Role::Tiny is
composed into unless that class already has an ->does method, so

  if ($foo->does('Some::Role')) {
    ...
  }

will work for classes but to test a role, one must use ::does_role directly.

Additionally, Role::Tiny will override the standard Perl C<DOES> method
for your class. However, if C<any> class in your class' inheritance
heirarchy provides C<DOES>, then Role::Tiny will not override it.

=head1 METHODS

=head2 apply_roles_to_package

 Role::Tiny->apply_roles_to_package(
   'Some::Package', 'Some::Role', 'Some::Other::Role'
 );

Composes role with package.  See also L<Role::Tiny::With>.

=head2 apply_roles_to_object

 Role::Tiny->apply_roles_to_object($foo, qw(Some::Role1 Some::Role2));

Composes roles in order into object directly.  Object is reblessed into the
resulting class.

=head2 create_class_with_roles

 Role::Tiny->create_class_with_roles('Some::Base', qw(Some::Role1 Some::Role2));

Creates a new class based on base, with the roles composed into it in order.
New class is returned.

=head1 SEE ALSO

L<Role::Tiny> is the attribute-less subset of L<Moo::Role>; L<Moo::Role> is
a meta-protocol-less subset of the king of role systems, L<Moose::Role>.

If you don't want method modifiers and do want to be forcibly restricted
to a single role application per class, Ovid's L<Role::Basic> exists. But
Stevan Little (the L<Moose> author) and I don't find the additional
restrictions to be amazingly helpful in most cases; L<Role::Basic>'s choices
are more a guide to what you should prefer doing, to our mind, rather than
something that needs to be enforced.

=head1 AUTHOR

mst - Matt S. Trout (cpan:MSTROUT) <mst@shadowcat.co.uk>

=head1 CONTRIBUTORS

dg - David Leadbeater (cpan:DGL) <dgl@dgl.cx>

frew - Arthur Axel "fREW" Schmidt (cpan:FREW) <frioux@gmail.com>

hobbs - Andrew Rodland (cpan:ARODLAND) <arodland@cpan.org>

jnap - John Napiorkowski (cpan:JJNAPIORK) <jjn1056@yahoo.com>

ribasushi - Peter Rabbitson (cpan:RIBASUSHI) <ribasushi@cpan.org>

chip - Chip Salzenberg (cpan:CHIPS) <chip@pobox.com>

ajgb - Alex J. G. Burzyński (cpan:AJGB) <ajgb@cpan.org>

doy - Jesse Luehrs (cpan:DOY) <doy at tozt dot net>

perigrin - Chris Prather (cpan:PERIGRIN) <chris@prather.org>

Mithaldu - Christian Walde (cpan:MITHALDU) <walde.christian@googlemail.com>

ilmari - Dagfinn Ilmari Mannsåker (cpan:ILMARI) <ilmari@ilmari.org>

tobyink - Toby Inkster (cpan:TOBYINK) <tobyink@cpan.org>

=head1 COPYRIGHT

Copyright (c) 2010-2012 the Role::Tiny L</AUTHOR> and L</CONTRIBUTORS>
as listed above.

=head1 LICENSE

This library is free software and may be distributed under the same terms
as perl itself.

=cut
