# Changelog

## [Unreleased]

### Added

### Updated

### Fixed

## [0.0.1] - 2022-11-03

### Added

    - Added base

## Backend adapter
- Added `src/Utilities/Backend` and `NEXT_PUBLIC_BACKEND=aws|standby`. Default `aws` is unchanged.
- All `aws-amplify` imports now go through `Utilities/Backend`; hard-coded S3 URLs replaced by `s3Url()`.
