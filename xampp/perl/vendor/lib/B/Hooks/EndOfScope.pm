package B::Hooks::EndOfScope;
BEGIN {
  $B::Hooks::EndOfScope::AUTHORITY = 'cpan:FLORA';
}
{
  $B::Hooks::EndOfScope::VERSION = '0.12';
}
# ABSTRACT: Execute code after a scope finished compilation

use strict;
use warnings;

# note - a %^H tie() fallback will probably work on 5.6 as well,
# if you need to go that low - sane patches passing *all* tests
# will be gladly accepted
use 5.008001;

BEGIN {
  require Module::Implementation;
  my $impl = Module::Implementation::implementation_for('B::Hooks::EndOfScope') || do {
    Module::Implementation::build_loader_sub(
      implementations => [ 'XS', 'PP' ],
      symbols => [ 'on_scope_end' ],
    )->();
    Module::Implementation::implementation_for('B::Hooks::EndOfScope');
  };

  *on_scope_end = $impl eq 'XS'
    ? \&B::Hooks::EndOfScope::XS::on_scope_end
    : \&B::Hooks::EndOfScope::PP::on_scope_end
  ;
}

use Sub::Exporter::Progressive -setup => {
  exports => [ 'on_scope_end' ],
  groups  => { default => ['on_scope_end'] },
};


1;

__END__
=pod

=encoding utf-8

=head1 NAME

B::Hooks::EndOfScope - Execute code after a scope finished compilation

=head1 SYNOPSIS

    on_scope_end { ... };

=head1 DESCRIPTION

This module allows you to execute code when perl finished compiling the
surrounding scope.

=head1 FUNCTIONS

=head2 on_scope_end

    on_scope_end { ... };

    on_scope_end $code;

Registers C<$code> to be executed after the surrounding scope has been
compiled.

This is exported by default. See L<Sub::Exporter> on how to customize it.

=head1 PURE-PERL MODE CAVEAT

While L<Variable::Magic> has access to some very dark sorcery to make it
possible to throw an exception from within a callback, the pure-perl
implementation does not have access to these hacks. Therefore, what
would have been a compile-time exception is instead converted to a
warning, and your execution will continue as if the exception never
happened.

To explicitly request an XS (or PP) implementation one has two choices. Either
to import from the desired implementation explicitly:

 use B::Hooks::EndOfScope::XS
   or
 use B::Hooks::EndOfScope::PP

or by setting C<$ENV{B_HOOKS_ENDOFSCOPE_IMPLEMENTATION}> to either C<XS> or
C<PP>.

=head1 SEE ALSO

L<Sub::Exporter>

L<Variable::Magic>

=head1 AUTHORS

=over 4

=item *

Florian Ragwitz <rafl@debian.org>

=item *

Peter Rabbitson <ribasushi@cpan.org>

=back

=head1 COPYRIGHT AND LICENSE

This software is copyright (c) 2012 by Florian Ragwitz.

This is free software; you can redistribute it and/or modify it under
the same terms as the Perl 5 programming language system itself.

=cut

