<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ManyMerchantsBRD - Products</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <nav>
      <a href="index.php">Home</a>
      <a href="products.php">Products</a>
      <a href="info.php">Info</a>
    </nav>
  </header>

  <main>
    <section id="product-list">
      <!-- Full product catalog will be rendered here by script.js -->
    </section>
  </main>

  <footer>
    <p>© Many Merchants</p>
  </footer>

  <!-- Pre-order modal -->
  <div id="preorder-modal" class="modal">
    <div class="modal-content">
      <h2>Pre-order Product</h2>
      <form id="preorder-form">
        <label for="pname">Name</label>
        <input type="text" id="pname" name="name" required>
        <label for="pemail">Email</label>
        <input type="email" id="pemail" name="email" required>
        <label for="pphone">Phone (optional)</label>
        <input type="tel" id="pphone" name="phone">
        <button type="submit">Submit Pre-order</button>
      </form>
    </div>
  </div>

  <script type="module" src="script.js"></script>
</body>
</html>
