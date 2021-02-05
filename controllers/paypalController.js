const config = require('config')
const port = config.get('app.port');
const host = config.get('app.host');
const paypal = require('paypal-rest-sdk');
const paypalConfig = config.get('paypalConfig').paypal;
paypal.configure(paypalConfig)

async function pay(req, res) {
    const { name, sku, price, currency, quantity, total, description } = req.query;

    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `${host}:${port}/success`,
            "cancel_url": `${host}:${port}/cancel`
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };


    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href)
                }
            }

        }
    });

}

module.exports = { pay };