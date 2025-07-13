"use client";

import { apiFetch } from "@/lib/backend/client";
import type { components } from "@/lib/backend/apiV1/schema";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type PostWithContentDto = components["schemas"]["PostDto"];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  const { id: idStr } = use(params);
  const id = parseInt(idStr);

  const [post, setPost] = useState<PostWithContentDto | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/posts/${id}`).then(setPost);
  }, []);

  if (post == null) return <div>로딩중...</div>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const titleInput = form.elements.namedItem("title") as HTMLInputElement;
    const contentTextarea = form.elements.namedItem(
      "content"
    ) as HTMLTextAreaElement;

    titleInput.value = titleInput.value.trim();

    if (titleInput.value.length === 0) {
      alert("제목을 입력해주세요.");
      titleInput.focus();
      return;
    }

    contentTextarea.value = contentTextarea.value.trim();

    if (contentTextarea.value.length === 0) {
      alert("내용을 입력해주세요.");
      contentTextarea.focus();
      return;
    }

    apiFetch(`/api/v1/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: titleInput.value,
        content: contentTextarea.value,
      }),
    }).then((data) => {
      alert(data.msg);
      router.replace(`/posts/${id}`);
    });
  };

  return (
    <>
      <h1>{id}번 글 수정</h1>

      <form className="flex flex-col gap-2 p-2" onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded"
          type="text"
          name="title"
          placeholder="제목"
          autoFocus
          defaultValue={post.title}
        />
        <textarea
          className="border p-2 rounded"
          name="content"
          placeholder="내용"
          defaultValue={post.content}
        />
        <button className="border p-2 rounded" type="submit">
          저장
        </button>
      </form>
    </>
  );
}