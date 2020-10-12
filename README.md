# [BICEP](https://bicep.bumperapptive.com)

[Developer Documentation](https://github.com/bumperactive-com/bicep/blob/master/DEVELOPERS.md)

[Usage Information](https://github.com/bumperactive-com/how-to/blob/master/bicep-usage.md)

## WHY BICEP?
- **To reduce complexity of maintaining old and new BigCommerce stores**
    - There are currently two very different product creation interfaces
    - A third is pending release and entering A/B Testing
        - We have no control over which stores use which interface
    - Designers having to learn and switch between various interfaces causes friction and errors in product creation
    - A single, unified interface we control is the ideal solution.

- **To reduce complexity of interface by ignoring unused features**
    - There is a subset of Product Creation features we use constantly, and a subset we never use.
    - Bicep ignores the unused features, thus reducing visual clutter and removing friction from the product creation process.

- **To reduce errors in new product setup**
    - The error rate in new products has historically been around 80%
    - **These errors fall into the following categories:**
        + Missing options
        + Misconfigured options
        + Expired and forgotten preorder dates
        + Malformed product description
        + Legacy products that do not fit current conventions
    - **Bicep offers the following remedies:**
        + Options created automatically (when possible)
        + Options configured automatically (when possible)
        + Greater visibility and access to set, view and remove preorder dates
        + Product description HTML preview to check format, fix description.
    - These features alone can dramatically reduce error rate.
    - There are still a couple specific options that cannot be set automatically
        + *Apparel Color* and *Apparel Brand* vary from product to product
        + These options must be created manually, and Bicep allows them to be viewed, set and deleted with ease.
            - Bicep is unable to fully prohibit human error but can reduce friction and increase visibility as much as possible.

- **To improve our ability to manage an ever-expanding product catalog**
    - We have 3000+ products spread between roughly 100 stores
    - Within each of those stores, the product information we need is often 3 or 4 menus deep
    - By emphasizing and displaying this information at the top-level, we get better visibility into the state of our catalog
        + As well as faster, easier access to make necessary changes.
    - Stores are always listed alphabetically for consistent navigation.
    - Products are listed alphabetically by default for consistent navigation.
        - Though other sort parameters are provided if needed.

- **To provide a visual representation of our catalog**
    - The interfaces provided by BigCommerce are not geared towards visually-oriented people such as designers.
    - By using color as a primary means of providing product information, we can again reduce mental friction in the product creation process.


## FEATURES
- **View all active stores**
    + Differentiate *prelaunch*, *live* and *maintenance* stores
- **See count of active stores**

- **View all products (alphabetical by SKU) for each active stores**
    + Differentiate *preorder*, *available* and *hidden products*
    + Differentiate *products*, *templates* and *sample products*
    + Sort products by total sold
    + Link to BigCommerce store dashboard and product pages
- **See count of products on store**

- **Toggle product visibilty**
- **Toggle featured products**
- **Set and remove preorder dates**
- **View product on storefront**
- **See creation date for each product**
- **See total views for each product**
- **See sales total for each product**
- **Upfront product thumbnail display for ease-of-use**

- **Edit product name**
- **Edit product SKU**
- **Edit product price**
- **Preview and edit product descriptions**

- **View and edit product variants**
    - Edit price and SKU for each variant
    - Disable specific variants
    - Mark variant options as *default*
    - Rename variant option values
    - Set variant-specific thumbnail images

- **View, edit, add and remove product modifiers**
    - Mark modifier options as *required*, *default*

- **Add new categories**
    - Assign products to category

- **Create a product from template**
    - Automatically marks default options
    - Automatically generates Sort Order value

- **Find a product by SKU**
