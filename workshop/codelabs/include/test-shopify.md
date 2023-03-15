### Testing a discount on Shopify

1. Navigate back to your app root:

    ```bash
    cd ../..
    ```

1. Deploy the functions in your app.

    ```bash
    npm run deploy
    ```

    - If asked, _Deploy to the same org and app as you used for dev?_, answer **Yes**.
    - When asked, _Make the following changes...?_, answer **Yes**.

    Once the deploy is complete, you will see a **Deployed to Shopify!** message.

1. Open your store admin and navigate to **Discounts**.

1. Click **Create discount** and then select the discount type you just created.

    - If you see an error screen, ensure you still have `npm run dev` executing in a terminal window.

1. Keep **Discount code** selected, and enter a discount code name based on the language of the discount you just created. (For example, **RUST** for Rust or **ZIG** for Zig.) Leave the other fields as default and click **Save**.

1. Open your online store and add **The Complete Snowboard** to your cart. Continue to **View my cart** and **Checkout**.

1. In **Contact information**, enter **karine.ruby@example.com**.

1. In **Discount code**, enter the code you just created, then click **Apply**.

You should immediately see the discount applied, based on the logic in the Wasm module you deployed to Shopify.

Note that if you change the customer (to one that's not a VIP), or add a different product (which doesn't qualify for VIP discounts), the discount is removed.

![Applied discount](images/discount-success.png)
