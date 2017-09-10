# Implementtion of a pure-perl on_scope_end for perls > 5.10
# (relies on Hash::Util:FieldHash)

package # hide from pause
  B::Hooks::EndOfScope::PP::FieldHash;

use strict;
use warnings;

use warnings;
use strict;

use Tie::Hash ();
use Hash::Util::FieldHash 'fieldhash';

# Here we rely on a combination of several behaviors:
#
# * %^H is deallocated on scope exit, so any references to it disappear
# * A lost weakref in a fieldhash causes the corresponding key to be deleted
# * Deletion of a key on a tied hash triggers DELETE
#
# Therefore the DELETE of a tied fieldhash containing a %^H reference will
# be the hook to fire all our callbacks.

fieldhash my %hh;
{
  package # hide from pause too
    B::Hooks::EndOfScope::PP::_TieHintHashFieldHash;
  use base 'Tie::StdHash';
  sub DELETE {
    my $ret = shift->SUPER::DELETE(@_);
    B::Hooks::EndOfScope::PP::__invoke_callback($_) for @$ret;
    $ret;
  }
}

sub on_scope_end (&) {
  $^H |= 0x020000;

  tie(%hh, 'B::Hooks::EndOfScope::PP::_TieHintHashFieldHash')
    unless tied %hh;

  push @{ $hh{\%^H} ||= [] }, shift;
}

1;

__END__
=pod

=encoding utf-8

=head1 NAME

B::Hooks::EndOfScope::PP::FieldHash

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

