let bookList = [];
let basketList = [];

// toggle menu
const toggleModal = () => {
  const basketModal = document.querySelector(".basket_modal");
  basketModal.classList.toggle("active");
  // html de iki elemana onclickverdik. onlara tıklanıldığında bu metot çalışacak
};

const getBooks = () => {
  fetch("./products.json")
    .then((res) => res.json())
    .then((books) => (bookList = books))
    /*then ile bize döndürdüğü diziyi, tekrar bir then yapısı kullanarak bize 
    döndürdüğü diziyi yakalayabiliyoruz. yani .then bize direk diziyi verdi*/
    /* sonra books ile yakaladığımız bize döndürdüğü diziyi 
    globalde tanımladığımız bookListe atıyoruz. booklist=books diyerek*/
    .catch((err) => console.log(err));
};
getBooks();

// dinamik yıldızlar
const createBookStars = (starRate) => {
  let starRateHtml =
    ""; /*spanın içine i etiketlerini aktaracağız. aslında aşağıdakine benzer */
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) {
      /*Math.round ile en yakın sayıya yuvarlıyoruz */
      starRateHtml += `<i class="bi bi-star-fill active"></i>`;
      /***** eğer sadce eşittir koysaydık içinde bir değişim olmazdı
            eşitler geçerdi. += dediğimizde içine ekliyor *****/
    } else {
      starRateHtml += `<i class="bi bi-star-fill"></i>`;
    }
  }
  return starRateHtml;
  /* starrateHtml'yi dışarı aktarmak içinde en son return starRateHtml
    dememiz gerekiyor. */
};

// html oluşturuldu ve içine kitaplar gönderildi
const createBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book_list");
  let bookListHtml = "";
  // html kodlarımızı bunun içine atalım. o yüzden ilk etapta boş
  // bunu ekrana aktaracağız yani.

  /* booklisti her elemanını forEach ile dönüyoruz. her elemanı book olarak 
    yakalıyoruz.bunları da bookListHtml'nin içine atacağız. niye bookListHtml +=
    şeklinde yaptık? biz burada tüm kitapları dönüyorruz. bize burada tek bir kitap
    vermediği için bunşarı ekrana aktarırken += ile bir tanesini ekrana 
    aktaracak sonra foreach ile tekrar dönecek ve tekrar içine atmasını 
    isteyeceğiz ondan dolayı += koyuyoruz.*/
  bookList.forEach((book, index) => {
    bookListHtml +=
      /*******forEach bize index değerinide versin dedik. indexi çift olanlar
        yani 2'ye bölümünden kalanı 0 olanlara offset-2 'yi verdik burada.
        index % 2 == 0 olduğunda && sağındaki "offset-2" uygula dedik diyebiliriz
        ******** index % 2 == 0 ? "offset-2" : "" şeklinde if else de olurdu ****/
      `
        <div class="col-5 ${index % 2 == 0 && "offset-2"} my-5">
        <div class="row book_card">
          <div class="col-6">
            <img
              src="${book.imgSource}"
              alt=""
              class="img-fluid shadow"
              width="258px"
              height="400px"
            />
          </div>
          <div class="col-6 d-flex flex-column justify-content-center gap-4">
            <div class="book-detail">
              <span class="fos gray fs-5">${book.author}</span> <br />
              <span class="fs-4 fw-bold">${book.name}</span> <br />
              <span class="book_star-rate">
                ${createBookStars(book.starRate)}     
                <span class="gray">${book.reviewCount} reviews</span>
              </span>
            </div>
            <p class="book_description fos gray">
              ${book.description}
            </p>
            <div>
              <span class="black fw-bold fs-4 me-2">${book.price}₺</span>
              <span class="fs-5 fw-bold old_price">${
                book.oldPrice
                  ? `<span class="fs-5 fw-bold old_price">${book.oldPrice}₺</span>`
                  : ""
              }</span>
            </div>
            <button class="btn_purple" onclick="addBookToBasket(${
              book.id
            })">Sepete Ekle</button>
          </div>
        </div>
      </div>
        `;
  });
  bookListEl.innerHTML = bookListHtml;
};

const BOOK_TYPES = {
  ALL: "Tümü",
  NOVEL: "Roman",
  CHILDREN: "Çocuk",
  HISTORY: "Tarih",
  FINANCE: "Finans",
  SCIENCE: "Bilim",
  SELFIMPROVEMENT: "Kişisel Gelişim",
};
const createBookTypesHtml = () => {
  const filterEle = document.querySelector(".filter");
  let filterHtml = "";

  // filtre türlerini tutacak dizi, "ALL" türüyle başlatılmıştır. daha sonra biz buna 6 tane daha ekleyeceğiz
  let filterTypes = [
    "ALL",
  ]; /*başlangıçta sadece "ALL" içeren bir dizi olarak başlattık.*/
  bookList.forEach((book) => {
    // eğer filtre türleri dizisinde bu tür bulunmuyorsa ekleme işlemi yapar. bir alttaki if'li kısım bu demek.
    if (filterTypes.findIndex((filter) => filter == book.type) == -1) {
      /*findIndex metodu, bir dizi içinde belirli bir koşul sağlayan
            ilk ögenin indeksini bulmak için kullanılır.*/
      /*filterTypes'ı findIndex ile döndük ve döndüken sonra bize filter
            verdi. bu filter da başlangıçta gelen "ALL" kısmı. Biz buraya
            dışardan gelecek olan book type'ları aktardık.*/
      /*-1 dememizin sebebi de, eğer dışardan gelen book type dan hiçbir
            şey gelmezse finIndex'in -1. metodunu alsın ve kapatsın filtertypes'ı.
            ve ALL'u direk alsın. bu anlama geliyor.*/
      filterTypes.push(book.type);
    }
  });
  filterTypes.forEach((type, index) => {
    /* onclick="filterBooks(this)"" buradaki this, li etiketini döndürüyor bize.*/
    filterHtml += `<li onclick="filterBooks(this)" data-types="${type}" class="${
      index == 0 ? "active" : null
    }">${BOOK_TYPES[type] || type}</li>`;
  });
  filterEle.innerHTML = filterHtml;
};
const filterBooks = (filterEl) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType = filterEl.dataset.types;
  // console.log(bookType)
  getBooks();
  if (bookType != "ALL") {
    /*bookList'i filter ile filtreleyeceğiz. bu bize bir item gönerecek biz bu
    iteme book dedik. bu gelen kitapların typları az önce yukarıda atadığımız ve
    bizim tıkladığımız kitapların type'ına eşitse (biz buna az yukarıda
    bookType dedik) tekrar createBookItemsHtml metodunu çağırsın */
    bookList = bookList.filter((book) => book.type == bookType);
  }
  createBookItemsHtml();
};

const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket_list");
  const basketCountEl = document.querySelector(".basket_count");

  const totalQuantity = basketList.reduce((total, item)=> total + item.quantity,0)
  basketCountEl.innerHTML = totalQuantity > 0 ? totalQuantity : null
  /*totalQuantity adlı bir değişken oluşturulur ve reduce fonksiyonu kullanılarak 
  sepet listesindeki her ürünün miktarı toplanır. Bu toplam, başlangıç değeri 
  olarak 0 (0 ikinci parametre) ile başlar. total, başlangıç değerimiz. item ise
  basketlist'ten gelen verilerimiz.*/
 
  const totalPriceEl = document.querySelector(".total_price")
  let basketListHtml = "";
  let totalPrice = 0;

  basketList.forEach((item) => {

    // sadece tek = koysak bir kere yapardı bu işlemi. biz liste her renderlandığında çalışsın istiyoruz.
    totalPrice += item.product.price * item.quantity
    /*itemin içindeki price ile itemin içindeki quantity'i
    (kaç adet varsa yani kaç miktar varsa, onu temsil ediyor) çarptık. */

    basketListHtml += `
    <li class="basket-item">
    <img
      src="${item.product.imgSource}"
      alt=""
      width="100"
      height="125"
    />
    <div class="basket_item-info">
      <h3 class="book_name">${item.product.name}</h3>
      <span class="book_price">${item.product.price}₺</span><br>
      <span class="book_remove" onclick="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
    </div>
    <div class="book_count">
      <span class="decrease" onclick="decreaseItemToBasket(${item.product.id})">-</span>
      <span class="mx-2">${item.quantity}</span>
      <span class="increase" onclick="increaseItemToBasket(${item.product.id})">+</span>
    </div>
  </li>
    `;
  });

  basketListEl.innerHTML = basketListHtml ? basketListHtml : `<p class="text-center w-100">Sepetinizde herhangi bir ürün bulunmamaktadır.</p>`;
  // basketListHtml varsa zaten bize bunu yazdırsın. ama yoksa ekrana sepetinizde ürün yoktur yazsın.

  totalPriceEl.innerHTML = totalPrice > 0 ? "Toplam: " + totalPrice + "₺" : null
  // totalprice 0 dan büyükse ekranda toplam: ve değeri yazsın. 0 dan büyük değilse bir şey yazmasın
};

// sepete ürün ekleme
const addBookToBasket = (bookId) => {
  /*booklist'in içindekileri find ile bulmak istiyoruz. find bize bir item döndürüyor
  ona da book dedik. bu kitapların id'sini book.id ile aldık. book id, bize
  tıkladığımız elemanın id'sini veriyor.*/
  /* tıkladığımız elemanın id'si ile döndüğümüz ve find ile bulduğumuz elemanın
  id'si eşitse, biz bunu bir değişkene atadık. */
  let findedBook = bookList.find((book) => book.id == bookId);
  if (findedBook) {

    /*basketAlreadyIndex değeri, basketList dizisinde bookId'ye sahip olan bir 
    öğe bulunmazsa -1 olacaktır. Eğer bu değer -1 ise, bu durumda "koşulu 
    sağlayan öğe bulunamadı" anlamına gelir.*/ 
    /*sepetteki ürünün var olup olmadığını kontrol ettik*/
    const basketAlreadyIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    /*basketList'i findIndex ile dönsün. bize bir basket versin. ve bu sepete
    eklediğimiz elemanın id'si ile addBookToBasket'a tıkladığımızda gönderdiğimiz
    id eşit ise bunu bir değişkene atasın en başta. */

    // eğer sepet boşsa veya eklenen kitap sepette yoksa
    if (basketAlreadyIndex == -1) {
      let addItem = { quantity: 1, product: findedBook };
      basketList.push(addItem);
    }else{
      /*eğer basketList'ten gelen id'li eleman varsa onu ekleme sadece miktarını arttır.*/
      basketList[basketAlreadyIndex].quantity += 1
    }
  }

  const btnCheck = document.querySelector(".btnCheck")
  btnCheck.style.display = "block"
  // btncheck'in sytle özelliklerinden olan displayini block yap dedik.

  // sepet içeriğini güncelle ve görüntüle
  listBasketItems();
};

// sepetten kaldır
const removeItemBasket = (bookId) =>{
  const findedIndex = basketList.findIndex((basket)=>basket.product.id == bookId)

  // eğer kitap sepet içinde bulunuyorsa
  if (findedIndex != -1){
    // splice, belirli sayıda elemanı silmek için kullandık
    // sepet listesinden kitabı çıkartır
    basketList.splice(findedIndex, 1)
  }

  const btnCheck = document.querySelector(".btnCheck")
  btnCheck.style.display = basketList.length > 0 ? "block" : "none"
  // bu sefer basketlist'in uzunluğu 0 dan büyükse hala görünsün, değilse none olsun

  // sepet içeriğini güncelledik
  listBasketItems()
}

// sepetteki ürünün miktarını azaltma
const decreaseItemToBasket = (bookId) =>{
  const findedIndex = basketList.findIndex((basket)=>basket.product.id==bookId)
  /*yine basketlist dizisini findIndex ile döneceğiz. döndükten sonra bize bir 
  basket verecek(içindeki ürünleri). tıkladığımız elemanın id'si ile basketlist
  içinde bulunana elemanın id'si eşit ise bunu bir değşekene atadık. yukarıdaki gibi */

  // eğer kitap sepet içinde bulunuyorsa
  if (findedIndex != -1){
    // eğer kitabın sayısı 1'den büyükse
    if (basketList[findedIndex].quantity != 1){
      basketList[findedIndex].quantity -= 1
    }else {
      removeItemBasket(bookId)
    }
    listBasketItems()
  }

  // sepet içeriğini güncelle
  listBasketItems()
}

// sepetteki ürününü miktarını arttırma
const increaseItemToBasket = (bookId) =>{
  const findedIndex = basketList.findIndex((basket)=>basket.product.id==bookId)
  // eğer kitap sepet içinde bulunuyorsa
  if(findedIndex != -1){
    // kitabın miktarını bir arttır
    basketList[findedIndex].quantity +=1
  }
  listBasketItems()
}

setTimeout(() => {
  createBookItemsHtml();
  createBookTypesHtml();
}, 100);
/* biz istek atınca cevap hemen gelmiyor. gelen cevabı beklememiz gerekiyor.
o yüzden böyle bir settimeOut içine aldık. eğer apiye apiye istek atsaydık, 
async await kullanmak daha mantıklı olurdu. ama yine de kullanılabilirdi*/
/*kitaplar için de cevap gelmesini bekledi. o yüzden diğer metodu da buraya aldık */
