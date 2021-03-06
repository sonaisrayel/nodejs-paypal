const config = require('config')
const port = config.get('app.port');
const host = config.get('app.host');
const paypal = require('paypal-rest-sdk');
const paypalConfig = config.get('paypalConfig').paypal;
paypal.configure(paypalConfig);

async function pay(req, res) {
    const create_payment_json = {
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
                    "name": 'SH100 WARM QUECHUA',
                    "price": "5.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "5.00"
            },
            "description": "БОТИНКИ ЗИМНИЕ МУЖСКИЕ ЧЕРНЫЕ SH100 WARM QUECHUA"
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


async function success(req, res) {
    const { PayerID, paymentId } = req.query

    const execute_payment_json = {
        "payer_id": PayerID,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "5.00"
            }
        }]

    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.error(error);
        } else {
            if (payment.state == 'approved') {
                res.send('Success');
            } else {
                res.send('payment not successful');
            }
        }
    });

}

module.exports = { pay, success };