import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";

export const AppLayout = ({ children}: { children: React.ReactNode }) => {
  const { user } = useUser();
  console.log('USER: ', user);
  return (
    <div className="grid grid-cols-[18.75rem_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800">
          <div>logo</div>
          <div>cta button</div>
          <div>tokens</div>
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          list of posts
        </div>
        <div className="flex bg-cyan-800 items-center gap-2 border-t border-t-black/50 h-20 px-2">
        {!!user ? (
          <>
            <div className="min-w-[50px]">
              <Image
                src={user.picture ?? ''}
                alt={user.name ?? ''}
                height={50}
                width={50}
                className="rounded-full"
              />
              
              
            </div>
            <div className="flex-1">
              <div className="font-bold">{user.nickname ?? ''}</div>
              <Link className="text-sm" href="/api/auth/logout">Logout</Link>
            </div>
          </>
        ) : (
          <Link href="/api/auth/login">Login</Link>
        )}
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};