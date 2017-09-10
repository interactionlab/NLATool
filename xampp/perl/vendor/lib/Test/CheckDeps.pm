package Test::CheckDeps;
{
  $Test::CheckDeps::VERSION = '0.002';
}
use strict;
use warnings FATAL => 'all';

use Exporter 5.57 'import';
our @EXPORT = qw/check_dependencies/;
our @EXPORT_OK = qw/check_dependencies_opts/;
our %EXPORT_TAGS = (all => [ @EXPORT, @EXPORT_OK ] );

use CPAN::Meta;
use CPAN::Meta::Check qw/check_requirements requirements_for/;
use List::Util qw/first/;
use Module::Metadata;
use Test::Builder;

my $builder = Test::Builder->new;

sub check_dependencies { 
	my $metafile = first { -e $_ } qw/MYMETA.json MYMETA.yml META.json META.yml/ or return $builder->ok(0, "No META information provided\n");
	my $meta = CPAN::Meta->load_file($metafile);
	check_dependencies_opts($meta, $_, 'requires') for qw/configure build test runtime/;
	check_dependencies_opts($meta, 'runtime', 'conflicts');
	return;
}

sub check_dependencies_opts {
	my ($meta, $phases, $type) = @_;

	my $reqs = requirements_for($meta, $phases, $type);
	my $raw = $reqs->as_string_hash;
	my $ret = check_requirements($reqs, $type);

	for my $module (keys %{$ret}) {
		$builder->ok(!defined $ret->{$module}, "$module satisfies '" . $raw->{$module} . "'") or $builder->diag($ret->{$module});
	}
	return;
}

1;

#ABSTRACT: Check for presence of dependencies



=pod

=head1 NAME

Test::CheckDeps - Check for presence of dependencies

=head1 VERSION

version 0.002

=head1 DESCRIPTION

This module adds a test that assures all dependencies have been installed properly. If requested, it can bail out all testing on error.

=head1 FUNCTIONS

=head2 check_dependencies()

Check all 'requires' dependencies based on a local MYMETA or META file.

=head2 check_dependencies_opts($meta, $phase, $type)

Check dependencies in L<CPAN::Meta> object $meta for phase C<$phase> (configure, build, test, runtime, develop) and type C<$type>(requires, recommends, suggests, conflicts). You probably just want to use C<check_dependencies> though.

=head1 AUTHOR

Leon Timmermans <leont@cpan.org>

=head1 COPYRIGHT AND LICENSE

This software is copyright (c) 2011 by Leon Timmermans.

This is free software; you can redistribute it and/or modify it under
the same terms as the Perl 5 programming language system itself.

=cut


__END__

