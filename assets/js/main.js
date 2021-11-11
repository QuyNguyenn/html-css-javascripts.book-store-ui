import flickityInitialize from "./flickity.js";
import bookSliderItems from "../data/bookSlider.js";
import popularBooks from "../data/popularBook.js";
import authorsOfWeek from "../data/authorsOfWeek.js";
import booksOfYear from "../data/booksOfYear.js";

function html([first, ...strings], ...values) {
    return values.reduce(
        (acc, cur) => acc.concat(cur, strings.shift()),
        [first]
    )
    .filter(x => x && x !== true || x === 0)
    .join('');
}


// Book Slide
const bookSlide = document.querySelector("#bs-1");
const bookSlideBgr = ["#fbadaf", "#a4dfea", "#edb9d6", "#fdca95", "#cbb5e2"];

let bookSliderHtmls = html`
        ${bookSliderItems.map((crr, index) => {
            return `
                <div class="book-cell" id="${bookSlide.id}-bc-${crr.id}" style="--background-book-cell: ${bookSlideBgr[index % 6]}">
                    <div class="book-img">
                        <img src="${crr.bookPhoto}" alt="" draggable="false" class="book-photo">
                    </div>
                    <div class="book-content">
                        <div class="book-title">"${crr.name}</div>
                        <div class="book-author">by "${crr.author}</div>
                        <div class="book-rate">
                            <fieldset class="rating">
                                <input type="checkbox" name="rating" id="${bookSlide.id}-bc-${crr.id}-star5" value="5">
                                <label for="${bookSlide.id}-bc-${crr.id}-star5" class="full">
                                    <i class="fas fa-star"></i>
                                </label>
                                <input type="checkbox" name="rating" id="${bookSlide.id}-bc-${crr.id}-star4" value="4">
                                <label for="${bookSlide.id}-bc-${crr.id}-star4" class="4">
                                    <i class="fas fa-star"></i>
                                </label>
                                <input type="checkbox" name="rating" id="${bookSlide.id}-bc-${crr.id}-star3" value="3">
                                <label for="${bookSlide.id}-bc-${crr.id}-star3" class="3">
                                    <i class="fas fa-star"></i>
                                </label>
                                <input type="checkbox" name="rating" id="${bookSlide.id}-bc-${crr.id}-star2" value="2">
                                <label for="${bookSlide.id}-bc-${crr.id}-star2" class="2">
                                    <i class="fas fa-star"></i>
                                </label>
                                <input type="checkbox" name="rating" id="${bookSlide.id}-bc-${crr.id}-star1" value="1">
                                <label for="${bookSlide.id}-bc-${crr.id}-star1" class="1">
                                    <i class="fas fa-star"></i>
                                </label>
                            </fieldset>
                            <span class="book-votes">"${crr.voteCount} voters</span>
                        </div>
                        <span class="book-sum">"${crr.summary}</span>
                        <div class="book-see">
                            <span>See The Book</span>
                        </div>
                    </div>
                </div>
            `
        })}
    `
bookSlide.querySelector(".flickity-slider").innerHTML = bookSliderHtmls;
flickityInitialize(".book-slide .js-flickity");


// Popular Book List
const popularBookList = document.querySelector("#bl-1");

let popularBookListHtmls = html`
    ${popularBooks.map(crr => {
        return `
            <div class="content__book-item" id="${popularBookList.id}-bi-${crr.id}">
                <div class="book-more-btn">
                    <!-- <i class="fas fa-ellipsis-v"></i> -->
                    <div class="three-dots"></div>
                </div>
                <div class="book-content">
                    <div class="book-img">
                        <img src="${crr.bookPhoto}" alt="">
                    </div>
                    <div class="book-infor">
                        <span class="book-name">${crr.name}</span>
                        <span class="book-author">by ${crr.author}</span>
                        <div class="book-rate">
                            <fieldset class="rating">
                                <input type="checkbox" name="rating" id="${popularBookList.id}-bi-${crr.id}-star5" value="5">
                                <label for="${popularBookList.id}-bi-${crr.id}-star5" class="full">
                                    <i class="fas fa-star"></i>
                                </label>
                                <input type="checkbox" name="rating" id="${popularBookList.id}-bi-${crr.id}-star4" value="4">
                                <label for="${popularBookList.id}-bi-${crr.id}-star4" class="4">
                                    <i class="fas fa-star"></i>
                                </label>
                                <input type="checkbox" name="rating" id="${popularBookList.id}-bi-${crr.id}-star3" value="3">
                                <label for="${popularBookList.id}-bi-${crr.id}-star3" class="3">
                                    <i class="fas fa-star"></i>
                                </label>
                                <input type="checkbox" name="rating" id="${popularBookList.id}-bi-${crr.id}-star2" value="2">
                                <label for="${popularBookList.id}-bi-${crr.id}-star2" class="2">
                                    <i class="fas fa-star"></i>
                                </label>
                                <input type="checkbox" name="rating" id="${popularBookList.id}-bi-${crr.id}-star1" value="1">
                                <label for="${popularBookList.id}-bi-${crr.id}-star1" class="1">
                                    <i class="fas fa-star"></i>
                                </label>
                            </fieldset>
                            <span class="book-votes">${crr.voteCount} voters</span>
                        </div>
                        <span class="book-sum">${crr.summary}</span>
                    </div>
                </div>
                <div class="book-footer">
                    <div class="liked-users-avatar">
                        <div class="liked-user-img">
                            <img src="./assets/img/account/avatar/63.jpg" alt="">
                        </div>
                        <div class="liked-user-img">
                            <img src="./assets/img/account/avatar/noplz47r59v1uxvyg8ku.png" alt="">
                        </div>
                        <div class="liked-user-img">
                            <img src="./assets/img/account/avatar/photo-1535713875002-d1d0cf377fde.jpg" alt="">
                        </div>
                    </div>
                    <span class="description"><strong>Samantha William</strong> and <strong>2 other friends</strong> like this</span>
                </div>
            </div>
        `
    })}
`
popularBookList.innerHTML = popularBookListHtmls;


// Authors of Week
const authorsOfWeekList = document.querySelector(".author-of-week .author-list");

let authorsOfWeekHtmls = html`
    ${authorsOfWeek.map(crr => {
        return `
            <li class="author-item">
                <div class="author-avatar">
                    <img src="${crr.avatar}" alt="">
                </div>
                <span class="author-name">${crr.name}</span>
            </li>
        `
    })}
`
authorsOfWeekList.innerHTML = authorsOfWeekHtmls;


// Book of the Year
const booksOfYearList = document.querySelector(".book-of-year .book-list");

let bookOfYearHtmls = html`
    ${booksOfYear.map(crr => {
        return `
            <li class="book-item">
                <div class="book-img">
                    <img src="${crr.bookPhoto}" alt="">
                </div>
                <div class="book-infor">
                    <span class="book-name">${crr.name}</span>
                    <span class="book-author">by ${crr.author}</span>
                </div>
            </li>
        `
    })}
`
booksOfYearList.innerHTML = bookOfYearHtmls;

