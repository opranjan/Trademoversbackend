const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');


const app = express();

// Set storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filter file types to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

app.use(express.json()); // To parse JSON data

// Set up CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  next();
});

app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
mongoose.connect('mongodb+srv://opranjan91700:crPwQ9TE3K62f77L@cluster0.kuvemgf.mongodb.net/Trademovers?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Create a product schema and model
const productSchema = new mongoose.Schema({
  productname: String,
  productmaterial: String,
  productcolor:String,
  productcategory:String,
  productsubcategory:String,
  productdescription:String,
  productprice:String,
  productsize:String,
  image: String,
});

const Product = mongoose.model('Product', productSchema);



// Route for uploading a product
app.post('/upload', upload.single('image'), async (req, res) => {
  const {productprice, productsize,productname, productmaterial ,productcolor,productcategory,productsubcategory,productdescription} = req.body;
  const imageFileName = req.file.filename;

  console.log(req.body)

  try {
    // Create a new product instance
    const product = new Product({
      productname,
      productmaterial,
      productcolor,
      productcategory,
      productsubcategory,
      productdescription,
      productsize,
      productprice,
      image: imageFileName,
    });

    console.log(product);

    // Save the product to the database
    await product.save();


    res.json({
      message: 'Product uploaded successfully!',
      product
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get all products
app.get('/products', async (req, res) => {
  try {
    // Retrieve all products from the database
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// Route to get a product by productid
app.get('/products/:id', async (req, res) => {
  try {
    // Find the product with the provided title in the database
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Route to get a product by productcategory
app.get('/products/productcategory/:productcategory', async (req, res) => {
  const productcategory = req.params.productcategory;
  try {
    // Find the product with the provided title in the database
    const product = await Product.find({ productcategory });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/products/productcategory/:productcategory/:id', async (req, res) => {
  const productcategory = req.params.productcategory;
  const id = req.params.id;
  try {
    // Find the product with the provided title in the database
    const product = await  Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.productcategory !== productcategory) {
      return res.status(400).json({ message: 'Product category does not match' });
    }


    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Route to get a product by productsubcategory
app.get('/products/productsubcategory/:productsubcategory', async (req, res) => {
  const productsubcategory = req.params.productsubcategory;
  try {
    // Find the product with the provided title in the database
    const product = await Product.find({ productsubcategory });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});







///// create contacts 


// Create a contacts schema and model
const contactSchema = new mongoose.Schema({
  name_of_person: String,
  name_of_company: String,
  mobileno_of_person:String,
  email_of_person:String,
  product_required:String,
  place: String,
  designation:String,
  description:String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Route for uploading a product
app.post('/contact', async (req, res) => {
  const {designation, name_of_person, name_of_company ,mobileno_of_person,email_of_person,product_required,place,description} = req.body;


  console.log(req.body)

  try {
    // Create a new product instance
    const contact = new Contact({
      designation,
      name_of_person,
      name_of_company,
      mobileno_of_person,
      email_of_person,
      product_required,
      place,
      description,
    });

    console.log(contact);

    // Save the product to the database
    await contact.save();


    res.json({
      message: ' Query sent successfully!',
      contact
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




////  get all contacts

// Route to get all contacts
app.get('/contacts', async (req, res) => {
  try {
    // Retrieve all products from the database
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});








const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
