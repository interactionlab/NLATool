package Params::Validate;
{
  $Params::Validate::VERSION = '1.07';
}

BEGIN { $ENV{PARAMS_VALIDATE_IMPLEMENTATION} = 'XS' }
use Params::Validate;

1;
