- Visit https://stripe.com/docs/stripe-cli for install instructions of Stripe CLI.

- Go to linux tab on how to download it.

- Run the following command when you are in the same directory with "stripe" CLI file.

```bash
# This command is to test payment confirmation locally.
./stripe listen --forward-to http://localhost:3000/payment-confirmation

# Auto trigger payment confirmation situation
# Remember both the above command and server has to run for this command to work.
./stripe trigger payment_intent.succeeded
```