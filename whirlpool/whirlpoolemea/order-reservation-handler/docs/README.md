# Order reservation handler

The application is responsible of avoiding long stock reservations due to payments not completed. Currently it is used only for payments with Paypal, because they remain in pending for about 3 days before being cancelled. Anyway the application is easily extendable to manage different payment methods. The application creates a cron job, upon installation, that triggers the job evry 15 minutes.

### Configuration

| Prop name   | Type     | Description                                                                                    |
| ----------- | -------- | ---------------------------------------------------------------------------------------------- |
| `startTime` | `string` | Max hours a payment can remain in pending, after which it will be cancelled by the application |

### In which accounts the application is installed

- frwhirlpool
