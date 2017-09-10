package Devel::GlobalDestruction;

use strict;
use warnings;

our $VERSION = '0.09';

use Sub::Exporter::Progressive -setup => {
  exports => [ qw(in_global_destruction) ],
  groups  => { default => [ -all ] },
};

# we run 5.14+ - everything is in core
#
if (defined ${^GLOBAL_PHASE}) {
  eval 'sub in_global_destruction () { ${^GLOBAL_PHASE} eq q[DESTRUCT] }; 1'
    or die $@;
}
# try to load the xs version if it was compiled
#
elsif (eval {
  require XSLoader;
  XSLoader::load(__PACKAGE__, $VERSION);
  1;
}) {
  # the eval already installed everything, nothing to do
}
# Not core nor XS
# The whole thing is in an eval to prevent perl from parsing it in the
# first place under perls where none of this is needed
#
else {
  eval <<'PP_IGD' or die $@;

# SpeedyCGI runs END blocks every cycle but somehow keeps object instances
# hence DIAF
die("The pure-perl version of @{[__PACKAGE__]} can not function correctly under CGI::SpeedyCGI. "
  . "Please ensure you have a working compiler, and reinstall @{[__PACKAGE__]} to enable the XS "
  . "codepath.\n"
) if $CGI::SpeedyCGI::i_am_speedy;

my ($in_global_destruction, $before_is_installed);

sub in_global_destruction () { $in_global_destruction }

# end_av trick suggested by liz++
require B;
my $add_endblock = sub {
  push @{ B::end_av()->object_2svref }, sub { $in_global_destruction = 1 };
};

# This block will fire towards the end of the program execution
# Use it to inject an END block which is guaranteed to run last
# (as long as something else doesn't inject yet another block in
# the same manner afterwards, at which point it hardly matters
# anyway)
#
END { $add_endblock->() }

# threads do not execute the global ENDs (it would be stupid). However
# one can register a new thread-local END from within a thread, and
# achieve the same result. A logical place to do this would be CLONE, which
# is claimed to run in the context of the new thread. However this does
# not really seem to be the case - any END inserted in a CLONE is ignored :(
# Hence blatantly hooking threads::create
#
if ($INC{'threads.pm'}) {
  require Scalar::Util;

  my $orig_create = threads->can('create');
  no warnings 'redefine';

  *threads::create = sub {
    my $class = shift;
    my $target = shift;

    unless ( (Scalar::Util::reftype($target)||'') eq 'CODE' ) {
      no strict 'refs';
      $target = \&{ caller() . "::$target" };
    }

    @_ = (
      $class,
      sub {
        # Perls compiled with THREADS_HAVE_PIDS do not copy end_av properly
        # between threads, so B::end_av ends up returning a B::SPECIAL and it
        # goes downhill from there
        # Install a noop END just to be on the safe side
        { local $@; eval 'END {}' }
        $add_endblock->();
        goto $target
      },
      @_,
    );

    goto $orig_create;
  };

  $before_is_installed = 1;
}

# just in case threads got loaded after us (silly)
sub CLONE {
  unless ($before_is_installed) {
    require Carp;
    Carp::croak("You must load the 'threads' module before @{[ __PACKAGE__ ]}");
  }
}

1;  # keep eval happy

PP_IGD

}

1;  # keep require happy


__END__

=head1 NAME

Devel::GlobalDestruction - Expose the flag which marks global
destruction.

=head1 SYNOPSIS

    package Foo;
    use Devel::GlobalDestruction;

    use namespace::clean; # to avoid having an "in_global_destruction" method

    sub DESTROY {
        return if in_global_destruction;

        do_something_a_little_tricky();
    }

=head1 DESCRIPTION

Perl's global destruction is a little tricky to deal with WRT finalizers
because it's not ordered and objects can sometimes disappear.

Writing defensive destructors is hard and annoying, and usually if global
destruction is happenning you only need the destructors that free up non
process local resources to actually execute.

For these constructors you can avoid the mess by simply bailing out if global
destruction is in effect.

=head1 EXPORTS

This module uses L<Sub::Exporter::Progressive> so the exports may be renamed,
aliased, etc. if L<Sub::Exporter> is present.

=over 4

=item in_global_destruction

Returns true if the interpreter is in global destruction. In perl 5.14+, this
returns C<${^GLOBAL_PHASE} eq 'DESTRUCT'>, and on earlier perls, it returns the
current value of C<PL_dirty>.

=back

=head1 AUTHORS

Yuval Kogman E<lt>nothingmuch@woobling.orgE<gt>

Florian Ragwitz E<lt>rafl@debian.orgE<gt>

Jesse Luehrs E<lt>doy@tozt.netE<gt>

Peter Rabbitson E<lt>ribasushi@cpan.orgE<gt>

Arthur Axel 'fREW' Schmidt E<lt>frioux@gmail.comE<gt>

Elizabeth Mattijsen E<lt>liz@dijkmat.nlE<gt>

=head1 COPYRIGHT

    Copyright (c) 2008 Yuval Kogman. All rights reserved
    This program is free software; you can redistribute
    it and/or modify it under the same terms as Perl itself.

=cut
