import { useUser } from "@auth0/nextjs-auth0/client";
import { faCoins } from "@fortawesome/free-solid-svg-icons/faCoins";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Logo } from "../Logo/Logo";
import Image from "next/image";
import Link from "next/link";

export const AppLayout = ({ children}: { children: React.ReactNode }) => {
  const { user } = useUser();
  console.log('USER: ', user);
  return (
    <div className="grid grid-cols-[18.75rem_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 p-2">
          <Logo />
          <Link 
            href="/post/new"
            className="btn"
          >
            <span className="hover:no-underline">New Post</span>
          </Link>
          <Link
            href="/token-topup"
            className="block mt-2 text-center"
          >
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">
              0 tokens available
            </span>
          </Link>
        </div>
        <div className="post-list">
          list of posts
        </div>
        <div className="sidebar-footer">
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