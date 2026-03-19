import { toast } from "sonner";

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'rnvpbn-de.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '55f7c4043127e3535ff455ff8cc89f27';

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Your store needs an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }
  return data;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export async function fetchProducts(first: number = 20, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query: query || null });
  return data?.data?.products?.edges || [];
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct["node"] | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data?.data?.productByHandle || null;
}

// --- Customer / Auth API ---

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id email firstName lastName }
      customerUserErrors { field message code }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { field message code }
    }
  }
`;

const CUSTOMER_QUERY = `
  query customer($token: String!) {
    customer(customerAccessToken: $token) {
      id email firstName lastName
      orders(first: 10) {
        edges {
          node {
            id orderNumber name processedAt
            totalPrice { amount currencyCode }
            statusUrl
            lineItems(first: 10) {
              edges {
                node {
                  title quantity
                  variant { image { url altText } price { amount currencyCode } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  orders?: {
    edges: Array<{
      node: {
        id: string;
        orderNumber: number;
        name: string;
        processedAt: string;
        totalPrice: { amount: string; currencyCode: string };
        statusUrl: string;
        lineItems: {
          edges: Array<{
            node: {
              title: string;
              quantity: number;
              variant: {
                image: { url: string; altText: string | null } | null;
                price: { amount: string; currencyCode: string };
              } | null;
            };
          }>;
        };
      };
    }>;
  };
}

export async function createCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}): Promise<{ customer: ShopifyCustomer | null; errors: Array<{ field: string[]; message: string; code: string }> }> {
  const data = await storefrontApiRequest(CUSTOMER_CREATE_MUTATION, { input });
  const result = data?.data?.customerCreate;
  return {
    customer: result?.customer || null,
    errors: result?.customerUserErrors || [],
  };
}

export async function customerLogin(email: string, password: string): Promise<{ accessToken: string; expiresAt: string } | { errors: Array<{ message: string }> }> {
  const data = await storefrontApiRequest(CUSTOMER_ACCESS_TOKEN_CREATE, {
    input: { email, password },
  });
  const result = data?.data?.customerAccessTokenCreate;
  if (result?.customerUserErrors?.length > 0) {
    return { errors: result.customerUserErrors };
  }
  return result?.customerAccessToken;
}

export async function fetchCustomer(accessToken: string): Promise<ShopifyCustomer | null> {
  const data = await storefrontApiRequest(CUSTOMER_QUERY, { token: accessToken });
  return data?.data?.customer || null;
}

export async function newsletterSignup(email: string): Promise<{ success: boolean; message: string }> {
  const result = await createCustomer({ email, password: crypto.randomUUID().slice(0, 20) + 'A1!', acceptsMarketing: true });
  if (result.errors.length > 0) {
    const alreadyExists = result.errors.some(e => e.code === 'TAKEN' || e.code === 'CUSTOMER_DISABLED');
    if (alreadyExists) {
      return { success: true, message: "You're already subscribed! Thank you." };
    }
    return { success: false, message: result.errors[0].message };
  }
  return { success: true, message: "Thank you for subscribing!" };
}
