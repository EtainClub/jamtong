import { redirect } from "next/navigation";

/** 소설은 아직 《면역》 한 편뿐이다. 목록 대신 그 시리즈로 보낸다. */
export default function NovelsPage() {
  redirect("/novels/immunity");
}
