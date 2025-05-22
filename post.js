import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, query, where, orderBy, getDocs, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
  document.getElementById("postTitle").innerText = "글 ID가 없습니다.";
  throw new Error("No postId in URL");
}

async function loadPost() { /* ... */ }
async function loadComments() { /* ... */ }
async function updateLikeCount() { /* ... */ }

// 아래처럼 onAuthStateChanged 사용
onAuthStateChanged(auth, (user) => {
  document.getElementById("commentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!user) {
      alert("로그인 후 댓글 작성 가능합니다.");
      return;
    }
    // ... 이하 생략
  });

  document.getElementById("likeBtn").addEventListener("click", async () => {
    if (!user) {
      alert("로그인 후 좋아요 가능합니다.");
      return;
    }
  });
});

// 메뉴 불러오기 (중복 없이 한 번만)
fetch('menu.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('menuContainer').innerHTML = html;
  });

// 페이지 로딩 시 데이터 불러오기
window.onload = async () => {
  await loadPost();
  await loadComments();
  await updateLikeCount();
};
