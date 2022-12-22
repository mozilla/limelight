# Limelight

## License

Limelight is released under the terms of the [Mozilla Public License 2.0](LICENSE).

## Code of Conduct

This repository follows a [code of conduct](CODE_OF_CONDUCT.md).

## Development

To run the development server, run:

```
npm run serve
```

To install Git hooks, run:

```
npm run install-hooks
```

### Sentry Integration

The following environment variables can be set to test the Sentry integration
locally:

- `SENTRY_DSN`, the client key for the Sentry project.
- `SENTRY_RELEASE`, the version to record as the release.
