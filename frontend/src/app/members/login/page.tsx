"use client";

import { apiFetch } from "@/lib/backend/client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const usernameInput = form.elements.namedItem("username") as HTMLInputElement;
    const passwordInput = form.elements.namedItem(
      "password"
    ) as HTMLTextAreaElement;

    usernameInput.value = usernameInput.value.trim();

    if (usernameInput.value.length === 0) {
      alert("제목을 입력해주세요.");
      usernameInput.focus();
      return;
    }

    if (usernameInput.value.length < 2) {
      alert("제목을 2자 이상 입력해주세요.");
      usernameInput.focus();
      return;
    }

    passwordInput.value = passwordInput.value.trim();

    if (passwordInput.value.length === 0) {
      alert("내용을 입력해주세요.");
      passwordInput.focus();
      return;
    }

    if (passwordInput.value.length < 2) {
      alert("내용을 2자 이상 입력해주세요.");
      passwordInput.focus();
      return;
    }

    apiFetch(`/api/v1/members/login`, {
      method: "POST",
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value,
      }),
    })
      .then((data) => {
        alert(data.msg);
        router.replace(`/`);
      })
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
  };

  return (
    <>
      <h1>로그인</h1>

      <form className="flex flex-col gap-2 p-2" onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded"
          type="text"
          name="username"
          placeholder=".아이디"
          autoFocus
          maxLength={30}
        />
        <input
          className="border p-2 rounded"
          name="password"
          placeholder="비밀번호"
          maxLength={5000}
        />
        <button className="border p-2 rounded" type="submit">
          로그인
        </button>
      </form>
    </>
  );
}