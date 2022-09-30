import { JSON, JSONEncoder } from "assemblyscript-json/assembly"; 
import { Console } from "./console";

/**
 * Input Types
 * These represent what's needed for our input query.
 **/
export class FunctionInput {
  cart: Cart | null = null;
  discountNode: DiscountNode | null = null;

  static parse(input: string): FunctionInput {
    const inputObj: JSON.Obj = <JSON.Obj>(JSON.parse(input));
    const parsed = new FunctionInput();
    parsed.unmarshal(inputObj);
    return parsed;
  }

  unmarshal(jsonObj: JSON.Obj): void {
    let cartObj: JSON.Obj | null = jsonObj.getObj("cart");
    if (cartObj != null) {
      const cart = new Cart();
      cart.unmarshal(cartObj);
      this.cart = cart;
    }
    let discountObj: JSON.Obj | null = jsonObj.getObj("discountNode");
    if (discountObj != null) {
      const discountNode = new DiscountNode();
      discountNode.unmarshal(discountObj);
      this.discountNode = discountNode;
    }
  }
}

export class Cart {
  buyerIdentity: BuyerIdentity | null

  unmarshal(jsonObj: JSON.Obj): void {
    let buyerIdentityObj: JSON.Obj | null = jsonObj.getObj("buyerIdentity");
    if (buyerIdentityObj != null) {
      const buyerIdentity = new BuyerIdentity();
      buyerIdentity.unmarshal(buyerIdentityObj);
      this.buyerIdentity = buyerIdentity;
    }
  }
}

export class BuyerIdentity {
  customer: Customer | null = null;

  unmarshal(jsonObj: JSON.Obj): void {
    let customerObj: JSON.Obj | null = jsonObj.getObj("customer");
    if (customerObj != null) {
      const customer = new Customer();
      customer.unmarshal(customerObj);
      this.customer = customer;
    }
  }
}

export class DiscountNode {
  metafield: Metafield | null = null;

  unmarshal(jsonObj: JSON.Obj): void {
    let metafieldObj: JSON.Obj | null = jsonObj.getObj("metafield");
    if (metafieldObj != null) {
      const metafield = new Metafield();
      metafield.unmarshal(metafieldObj);
      this.metafield = metafield;
    }
  }
}

export class Customer {
  metafield: Metafield | null = null;

  unmarshal(jsonObj: JSON.Obj): void {
    let metafieldObj: JSON.Obj | null = jsonObj.getObj("metafield");
    if (metafieldObj != null) {
      const metafield = new Metafield();
      metafield.unmarshal(metafieldObj);
      this.metafield = metafield;
    }
  }
}

export class Metafield {
  value: string | null = null;

  unmarshal(jsonObj: JSON.Obj): void {
    let valueObj = jsonObj.getString("value");
    if (valueObj != null) {
      this.value = valueObj.valueOf();
    }
  }
}

/**
 * Configuration Types
 * These represent the JSON metafield where we are storing our configuration.
 */
export class Configuration {
  discountPercentage: f64 = 0.0;

  static parse(input: string): Configuration {
    const inputObj: JSON.Obj = <JSON.Obj>(JSON.parse(input));
    const parsed = new Configuration();
    parsed.unmarshal(inputObj);
    return parsed;
  }

  unmarshal(jsonObj: JSON.Obj): void {
    let discountPercentageObj = jsonObj.getValue("discountPercentage");
    if (discountPercentageObj != null) {
      if (discountPercentageObj.isFloat) {
        this.discountPercentage = (<JSON.Float>discountPercentageObj).valueOf();
      } else if (discountPercentageObj.isInteger) {
        this.discountPercentage = (f64)((<JSON.Integer>discountPercentageObj).valueOf());
      }
    }
  }
}

/**
 * Output Types
 * These just represent the part of the schema needed for this function.
 **/

export class PercentageValue {
    value: f64 = 0;

    marshal(encoder: JSONEncoder): void {
      encoder.setFloat("value", this.value);
    }
}

export class PercentageValueType {
    percentage: PercentageValue = new PercentageValue();

    marshal(encoder: JSONEncoder): void {
      encoder.pushObject("percentage");
      this.percentage.marshal(encoder);
      encoder.popObject();
    }
}

export class OrderSubtotalTarget {
    orderSubtotal: OrderSubtotalTargetType = new OrderSubtotalTargetType();

    marshal(encoder: JSONEncoder): void {
      encoder.pushObject("orderSubtotal");
      this.orderSubtotal.marshal(encoder);
      encoder.popObject();
    }
}

export class OrderSubtotalTargetType {
    excludedVariantIds: string[] = [];

    marshal(encoder: JSONEncoder): void {
      encoder.pushArray("excludedVariantIds");
      for (let i = 0; i < this.excludedVariantIds.length; i++) {
        encoder.setString(null, this.excludedVariantIds[i]);
      }
      encoder.popArray();
    }
}

export class OrderDiscount {
    message: string | null = null;
    targets: OrderSubtotalTarget[] = [];
    value: PercentageValueType | null = null;

    marshal(encoder: JSONEncoder): void {
      if (this.message != null) {
        encoder.setString("message", this.message!);
      }
      encoder.pushArray("targets");
      for (let i = 0; i < this.targets.length; i++) {
        encoder.pushObject(null);
        this.targets[i].marshal(encoder);
        encoder.popObject();
      }
      encoder.popArray();
      if (this.value != null) {
        encoder.pushObject("value");
        this.value!.marshal(encoder);
        encoder.popObject();
      }
    }
}

export class FunctionResult {
    discountApplicationStrategy: string | null = null;
    discounts: OrderDiscount[] = [];

    marshal(): string {
      let encoder = new JSONEncoder();
      encoder.pushObject(null);
      
      if (this.discountApplicationStrategy != null) {
        encoder.setString("discountApplicationStrategy", this.discountApplicationStrategy!);
      }
      encoder.pushArray("discounts");
      for (let i = 0; i < this.discounts.length; i++) {
        encoder.pushObject(null);
        this.discounts[i].marshal(encoder);
        encoder.popObject();
      }
      encoder.popArray();

      encoder.popObject();
      return encoder.toString();
    }
}