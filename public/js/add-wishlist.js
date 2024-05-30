const addWishlist = document.getElementById('addWishlist');

addWishlist.addEventListener('click', function() {
    const inv_id = addWishlist.getAttribute('data-inv-id');
    console.log(inv_id);
    const url = `/wishlist/add/${inv_id}`;
    fetch(url)
    .then(function(response) {
        if(response.ok) {
            return response.json();
        }
        throw Error('Network response was not OK');
    })
    .then(function(data) {
        console.log(data);
        alert('Vehicle added to your wishlist');
    })
    .catch(function(error) {
        console.log('There was a problem: ', error.message);
    })
});

pswdBtn.addEventListener('click', function() {
    const pswdInput = document.querySelector('#password');
    const type = pswdInput.getAttribute('type') 
    if (type == 'password') {
        pswdInput.setAttribute('type', 'text');
        pswdBtn.innerHTML = 'Hide Password';
     } else {
        pswdInput.setAttribute('type', 'password');
        pswdBtn.innerHTML = 'Show Password';
     }
});