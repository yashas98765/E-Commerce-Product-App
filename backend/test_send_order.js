(async ()=>{
  try{
    const waitFor = ms=>new Promise(r=>setTimeout(r,ms));
    // wait a bit for server to be ready
    await waitFor(800);
    const loginRes = await fetch('http://localhost:5000/api/auth/login',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({ email: 'user@shopnest.com', password: 'User@123' })
    });
    const login = await loginRes.json();
    console.log('login status', loginRes.status, login.message || 'ok');
    const token = login.token;
    if(!token) throw new Error('No token from login');

    const productsRes = await fetch('http://localhost:5000/api/products');
    const products = await productsRes.json();
    const p = products.products ? products.products[0] : products[0];
    if(!p) throw new Error('No product found');

    const orderBody = { items: [{ product: p._id, name: p.name, price: p.price, quantity: 1 }], total: p.price };
    const ord = await fetch('http://localhost:5000/api/orders',{
      method:'POST',
      headers:{ 'content-type':'application/json', Authorization: 'Bearer '+token },
      body: JSON.stringify(orderBody)
    });
    const od = await ord.json();
    console.log('create order status', ord.status, od.message || od.order || JSON.stringify(od));
  } catch(e){
    console.error('error:', e.message || e);
    process.exit(1);
  }
})();
