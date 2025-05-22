import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, query, where, orderBy, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = { /* ... community.html의 설정 복사 ... */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

async function loadPost() {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);
  if (postSnap.exists()) {
    const data = postSnap.data();
    document.getElementById("postTitle").innerText = data.title;
    document.getElementById("postContent").innerText = data.content;
  } else {
    document.getElementById("postTitle").innerText = "글을 찾을 수 없습니다.";
  }
}

async function loadComments() {
  const q = query(collection(db, "comments"), where("postId", "==", postId), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  const list = document.getElementById("commentList");
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerText = `${data.authorname || "익명"}: ${data.comment}`;
    list.appendChild(li);
  });
}

document.getElementById("commentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const comment = document.getElementById("commentInput").value.trim();
  const user = auth.currentUser;
  if (!user) {
    alert("로그인 후 댓글 작성 가능합니다.");
    return;
  }
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const nickname = userDoc.exists() ? userDoc.data().nickname : "익명";
  await addDoc(collection(db, "comments"), {
    comment,
    postId, // 게시글 식별
    authorname: nickname,
    uid: user.uid,
    timestamp: new Date(),
  });
  document.getElementById("commentForm").reset();
  loadComments();
});

// 좋아요(Like) 기능 구현 (간단 버전)
document.getElementById("likeBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("로그인 후 좋아요 가능합니다.");
    return;
  }
  const likeRef = doc(db, "likes", `${postId}_${user.uid}`);
  const likeSnap = await getDoc(likeRef);
  if (!likeSnap.exists()) {
    await setDoc(likeRef, { postId, uid: user.uid });
  } else {
    alert("이미 좋아요를 누르셨습니다.");
  }
  updateLikeCount();
});
async function updateLikeCount() {
  const q = query(collection(db, "likes"), where("postId", "==", postId));
  const snapshot = await getDocs(q);
  document.getElementById("likeCount").innerText = snapshot.size;
}

// 초기 로딩
window.onload = async () => {
  await loadPost();
  await loadComments();
  await updateLikeCount();
};
