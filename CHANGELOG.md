# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2023-03-10

### Fixed

- Firefox incorrectly displays not connected view. Increased connection check timeout

### Changed

- Rearrange state in event payload to present information more clearly and remove redundancy
- Downgrade Firefox extension to Manifest V2

## [0.1.0] - 2023-03-05

### Added

- Initial release with session and file system events
- Display apps by namespace
- Display links to ODD SDK docs and ODD Devtools issue tracker
- Clear logs for all namespaces
- Clear logs for one namespace and jump to most recent event in a namespace
- Filter events by values in event payload