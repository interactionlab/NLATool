package Params::Validate;
{
  $Params::Validate::VERSION = '1.07';
}

BEGIN { $ENV{PARAMS_VALIDATE_IMPLEMENTATION} = 'PP' }
use Params::Validate;

1;
