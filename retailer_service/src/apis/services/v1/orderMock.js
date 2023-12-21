const deliveryBoy = {
  name: 'Rakesh',
  phone: '9461287337',
};

const shop = {
  name: 'Local Garden',
  address: 'Laxman Nagar Delhi',
  image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/dragon.jpeg',
};
const sellar = {
  name: 'Rakesh',
  phone: '9461287337',
  image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
};

const picker = {
  name: 'Rakesh',
  phone: '9461287337',
  image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
};

const user = {
  name: 'Rahul',
  phone: '9461287337',
  image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
};

const location = {
  address: 'test1,test2',
  type: 'Home',
  lat: '12',
  lon: '15',
};

// delivery mode can be 'DELIVERY', 'PICKUP'
const delivery = {
  location,
  mode: 'DELIVERY',
  date: '26th May',
  slot: '1000-1400',
  instructions:
    'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit',
};

// payment status can be 'PENDING', 'PAID'
// payment mode can be 'POSTPAID', 'PREPAID'
const payment = {
  status: 'PENDING',
  mode: 'POSTPAID',
};

const products = [
  {
    id: '1',
    sku: '1',
    name: 'Strawberry',
    price: '90',
    qty: '1',
    unit: '500g',
  },
];

module.exports = {
  deliveryBoy,
  shop,
  sellar,
  delivery,
  payment,
  products,
  picker,
  user,
};
