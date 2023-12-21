const express = require('express');
const { HttpResponseHandler } = require('sarvm-utility');
const MasterProduct = require('@controllers/v1/MasterProduct');

const router = express.Router();

const fs = require('fs');
const Pool = require('pg').Pool;
const fastcsv = require('fast-csv');

const multer = require('multer');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/apis/routes/v1');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, 'files.csv');
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[1] === 'csv') {
    cb(null, true);
  } else {
    cb(new Error('Not a PDF File!!'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const link = './src/apis/routes/v1/files.csv';

let csvData = [];
let awsImgUrl = 'aws-url/';

let insertQueries = [
  'INSERT INTO category(name,picture) VALUES ($1,$2)',
  'INSERT INTO sub_category(parent_id,name,picture) VALUES ($1,$2,$3)',
  'INSERT INTO micro_category(parent_id,name,picture) VALUES ($1,$2,$3)',
  'INSERT INTO master_product(name,picture,tax,min_price,max_price) VALUES ($1,$2,$3,$4,$5)',
  'INSERT INTO master_product_category(product_id,category_id,sub_category_id,micro_category_id) VALUES ($1,$2,$3,$4)',
];

let selectQueries = [
  'SELECT * FROM category WHERE name=$1',
  'SELECT * FROM sub_category WHERE name=$1',
  'SELECT * FROM micro_category WHERE name=$1',
  'SELECT * FROM master_product WHERE name=$1',
  'SELECT * FROM master_product_category WHERE product_id=$1 and category_id=$2 and sub_category_id=$3 and micro_category_id=$4',
];

const connectionString = `postgresql://${'postgres'}:${'12345'}@${'localhost'}:${5432}/${'master_catalogue'}`;

const pool = new Pool({
  connectionString: connectionString,
});

pool.on('connect', () => {
  console.log('connected to the database');
});

function convertToSnakeCase(img) {
  let newImg = '';
  let prev = 0; // indicates no underscore just previous

  for (let i = 0; i < img.length; i++) {
    if (img[i] == ' ' && prev == 0) {
      newImg += '_';
      prev = 1;
    } else if (img[i] != ' ') {
      newImg += img[i];
      prev = 0;
    }
  }

  let n = newImg.length - 1;

  if (newImg[n] == ' ') newImg = newImg.substring(0, n);

  return newImg;
}

async function insertData(row) {
  let data, category_id, sub_category_id, micro_category_id, product_id;

  let imgUrlCategory = awsImgUrl + 'category/',
    imgUrlSubCategory = awsImgUrl + 'subcategory/',
    imgUrlMicroCategory = awsImgUrl + 'microcategory/',
    imgUrlProduct = awsImgUrl + 'product/';

  //insert category
  data = await pool.query(selectQueries[0], [row[0]]);

  if (data.rowCount == 0) {
    let arr = [];

    arr.push(row[0]);

    arr.push(imgUrlCategory + convertToSnakeCase(row[0]));

    const inserted = await pool.query(insertQueries[0], arr);

    data = await pool.query(selectQueries[0], [row[0]]);
  }

  category_id = data.rows[0]['category_id'];

  //insert sub_category
  data = await pool.query(selectQueries[1], [row[1]]);

  if (data.rowCount == 0) {
    let arr = [];

    arr.push(category_id);

    arr.push(row[1]);

    arr.push(imgUrlSubCategory + convertToSnakeCase(row[1]));

    const inserted = await pool.query(insertQueries[1], arr);

    data = await pool.query(selectQueries[1], [row[1]]);
  }

  sub_category_id = data.rows[0]['sub_category_id'];

  //insert micro_category
  data = await pool.query(selectQueries[2], [row[2]]);

  if (data.rowCount == 0) {
    let arr = [];

    arr.push(sub_category_id);

    arr.push(row[2]);

    arr.push(imgUrlMicroCategory + convertToSnakeCase(row[2]));

    const inserted = await pool.query(insertQueries[2], arr);

    data = await pool.query(selectQueries[2], [row[2]]);
  }

  micro_category_id = data.rows[0]['micro_category_id'];

  //insert product
  data = await pool.query(selectQueries[3], [row[3]]);

  let tax = 12,
    minPrc = 10,
    maxPrc = 1000;

  if (data.rowCount == 0) {
    let arr = [row[3], imgUrlProduct + convertToSnakeCase(row[3]), tax, minPrc, maxPrc];

    const inserted = await pool.query(insertQueries[3], arr);

    data = await pool.query(selectQueries[3], [row[3]]);
  }

  product_id = data.rows[0]['product_id'];

  //insert master_product_category -> relation table
  let present = [product_id, category_id, sub_category_id, micro_category_id];

  data = await pool.query(selectQueries[4], present);

  if (data.rowCount == 0) {
    const inserted = await pool.query(insertQueries[4], present);

    data = await pool.query(selectQueries[4], present);
  }
}

router.post('/', upload.single('csvfile'), async (req, res, next) => {
  try {
    let stream = fs.createReadStream(link);

    let csvStream = fastcsv
      .parse()
      .on('data', async function (data) {
        csvData.push(data);
      })
      .on('end', async function () {
        csvData.shift();

        try {
          for (row of csvData) {
            await insertData(row);
          }
        } catch (err) {
          console.log(err);
        }
      });

    stream.pipe(csvStream);

    HttpResponseHandler.success(req, res, 'Populated Successfully');
  } catch (error) {
    next(error);
  }
});

router.get('/product-json', async (req, res) => {
  const data = await pool.query(
    'Select product_id,name,picture,hsn,tax,min_price,max_price,status from master_product',
  );

  let ans = {};

  for (let i = 0; i < data.rowCount; i++) {
    ans[data.rows[i]['product_id']] = data.rows[i];
  }

  fs.writeFileSync('./src/apis/routes/v1/JSON/prod.json', JSON.stringify(ans, null, 4), 'utf-8', (err) => {
    if (err) console.log(err);
  });

  return res.send(ans);
});

router.get('/micro_category-json', async (req, res) => {
  const data = await pool.query('Select micro_category_id,name from micro_category');

  let ans = {};

  for (let i = 0; i < data.rowCount; i++) {
    let microId = data.rows[i]['micro_category_id'];

    console.log(microId);

    const productObj = await pool.query('Select product_id from master_product_category where micro_category_id = $1', [
      microId,
    ]);

    let product = [];

    for (let i = 0; i < productObj.rowCount; i++) {
      product.push(productObj.rows[i]['product_id']);
    }

    let now = {
      name: data.rows[i]['name'],
      product: product,
    };

    ans[microId] = now;
  }

  fs.writeFileSync('./src/apis/routes/v1/JSON/micro.json', JSON.stringify(ans, null, 4), 'utf-8', (err) => {
    if (err) console.log(err);
  });

  return res.send(ans);
});

router.get('/category-json', async (req, res) => {
  const data = await pool.query('Select category_id,name,picture from category');

  let ans = {};

  for (let i = 0; i < data.rowCount; i++) {
    let categoryId = data.rows[i]['category_id'];

    let name = data.rows[i]['name'];

    let picture = data.rows[i]['picture'];

    const subcategoryList = await pool.query(
      'Select distinct sub_category_id from master_product_category where category_id = $1',
      [categoryId],
    );

    console.log(subcategoryList.rows);

    let subCategories = [];

    for (let j = 0; j < subcategoryList.rowCount; j++) {
      let productList = [],
        microList = [];

      let subData = await pool.query(
        'Select sub_category_id,name,picture from sub_category where sub_category_id = $1',
        [subcategoryList.rows[j]['sub_category_id']],
      );

      let subId = subData.rows[0]['sub_category_id'];
      let name = subData.rows[0]['name'];
      let picture = subData.rows[0]['picture'];

      let prodData = await pool.query(
        'Select distinct product_id from master_product_category where sub_category_id = $1',
        [subId],
      );

      for (let k = 0; k < prodData.rowCount; k++) {
        productList.push(prodData.rows[k]['product_id']);
      }

      let microData = await pool.query(
        'Select distinct micro_category_id from master_product_category where sub_category_id = $1',
        [subId],
      );

      for (let i = 0; i < microData.rowCount; i++) {
        microList.push(microData.rows[i]['micro_category_id']);
      }

      let toPutData = {
        id: subId,
        name: name,
        product: productList,
        microCategories: microList,
        image: picture,
      };

      subCategories.push(toPutData);
    }

    let now = {
      id: categoryId,
      subCategory: subCategories,
      image: picture,
      name: name,
    };

    ans[name] = now;
  }

  fs.writeFileSync('./src/apis/routes/v1/JSON/category.json', JSON.stringify(ans, null, 4), 'utf-8', (err) => {
    if (err) console.log(err);
  });

  return res.send(ans);
});

module.exports = router;
