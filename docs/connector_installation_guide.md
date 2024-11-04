# Connector Installation Guide

## Overview

1. [Prerequisites](#Prerequisites)
2. [How to install](#how-to-Install)
3. [How to configure message template](#how-to-configure-message-template)
4. [Requirements and Restrictions](#requirements-and-restrictions)
5. [Supported services](#supported-services)

## 1. Prerequisites

* A CommerceTools project.
* A Twilio account with WhatsApp API access.

## 2. How to Install

Before you begin, ensure you have the following:

1. **Twilio Account**:

   * Create an account on [Twilio](https://www.twilio.com/).
   * Note down your Twilio credentials for deployment:
     * **TWILIO\_ACCOUNT\_SID**: Used to authenticate REST API requests.
     * **TWILIO\_AUTH\_TOKEN**: Used to authenticate REST API requests.
     * **TWILIO\_FROM\_NUMBER**: A WhatsApp-enabled phone number provided by Twilio, also known as a WhatsApp Sender.
2. **CommerceTools API Client**:

   * To deploy and use the CommerceTools connector, you need a dedicated API client. Create it by following these steps:
     1. Navigate to **Settings** > **Developer Settings**.
     2. Click on **Create new API client** (top right corner) using the **Admin client scope template**.
   * Note down the following credentials:
     * **CTP\_CLIENT\_ID**: The unique identifier for your CommerceTools API client.
     * **CTP\_CLIENT\_SECRET**: The secret used for authenticating your API client.
     * **CTP\_PROJECT\_KEY**: The key for your CommerceTools project.
     * **CTP\_SCOPE**: The necessary scopes that define the permissions for your API client.
3. Other required variables.

   * CUSTOM\_MESSAGE\_TEMPLATE : Specifies the template for the whatsapp message body.

## 3. How to configure message template

Instructions to input a custom message template into the application for sending WhatsApp messages. The template can be customized to include dynamic data from an **[order](https://docs.commercetools.com/api/projects/orders#order)**.

### Example message template

```plaintext
Hello {{shippingAddress.firstName}},\n\n your order #{{id}} has been confirmed! Total: {{totalPrice.centAmount}} {{totalPrice.currencyCode}}
```

### Input Formatting

To format your message correctly, follow these guidelines:

* **Line Breaks**: Use `\n` for a new line. For example, `\n\n` creates a double line break, which separates sections of the message for clarity.
* **Spaces**: Ensure there are spaces around the placeholders for better readability.

### Placeholders

Placeholders in the message template are dynamically replaced with actual data from the order object. Here’s a breakdown of the placeholders used in the template:

* `{{shippingAddress.firstName}}`: Represents the first name of the customer from the order's shipping address. It refers to an attribute in the **[order](https://docs.commercetools.com/api/projects/orders#order)**

  ```json
  {
    "shippingAddress": {
      "firstName": "some_name"
    }
  }
  ```
* response JSON object:
* `{{id}}`: Refers to the unique identifier of the **[order](https://docs.commercetools.com/api/projects/orders#order)**.
* `{{totalPrice.centAmount}}`: Represents the total price of the [order ](https://docs.commercetools.com/api/projects/orders#order)in cents.
* `{{totalPrice.currencyCode}}`: Denotes the currency code for the order (e.g., USD, EUR).

If you want to set an attribute from an array of objects you can follow this instructions.

```json
"taxedPrice": {
    ...
        "taxPortions": [
            {
                "rate": 0.0725,
                "amount": {
                    "type": "centPrecision",
                    "currencyCode": "USD",
                    "centAmount": 507,
                    "fractionDigits": 2
                },
                "name": "California"
            }
        ],
       ...
    },
```

* If you want to get the `rate` value from all index you can simply modify your template placeholder like this `{{taxedPrice.taxPortions[*].rate}}`
* ```plaintext
  Hello {{shippingAddress.firstName}},\n\n your order #{{id}} has been confirmed! at rate : {{taxedPrice.taxPortions[*].rate}}
  ```
* If you want to get the `rate` value from specific index then  you can simply specify the index `[ 0, 1, 2, ... ]` like this `{{taxedPrice.taxPortions[0].rate}}`
* ```plaintext
  Hello {{shippingAddress.firstName}},\n\n your order #{{id}} has been confirmed! at rate : {{taxedPrice.taxPortions[0].rate}}
  ```

### Incorrect Formats

```plaintext
Hello, your order has been confirmed! Total: .
```

### Improper Line Breaks:

```plaintext
Hello {{shippingAddress.firstName}}, Your order #{{id}} has been confirmed!
```

* In this format, the lack of `\n` results in a cramped message.

## Requirements and Restrictions:

* **Mandatory Fields**: Ensure that all placeholders are populated with valid data from the order response to avoid sending incomplete messages.
* **Character Limits**: Consider WhatsApp's character limits (typically 4096 characters for messages) to ensure the message does not get truncated.
* **Dynamic Data**: Ensure the order object is fully populated with the necessary attributes (e.g., `shippingAddress`, `id`, `totalPrice`) before generating the message.
* **Supported resource**: Currently, this application supports only the order resource. Please refer [CommerceTools official documentation](https://docs.commercetools.com/api/projects/orders#order) for order resource and its attributes for more details.

## Supported services

1. Sending messages to customer on order confirmation via WhatsApp
