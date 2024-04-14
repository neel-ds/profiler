"use client";
import { init, useQuery } from "@airstack/airstack-react";
import { useEffect, useMemo, useState } from "react";

interface Cast {
  fid: string;
  castedBy: {
    followingCount: number;
    followerCount: number;
    userAssociatedAddresses: string[];
  };
  text: string;
}

function Profiler() {
  const [farcasterProfiles, setFarcasterProfiles] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });

  const sortedProfiles = useMemo(() => {
    let sortableItems = [...farcasterProfiles];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key && a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (sortConfig.key && a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [farcasterProfiles, sortConfig]);

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);
  const query = `query MyQuery {
    FarcasterCasts(input: {filter: {}, blockchain: ALL}) {
      Cast {
        fid
        castedBy {
          followingCount
          followerCount
          userAssociatedAddresses
        }
        text
      }
    }
  }`;
  const { data, loading, error } = useQuery(query);

  const setProfile = async (data: Cast[]) => {
    const farcasterProfiles = await fetch("/api/setProfiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(farcasterProfiles);
    const response = await farcasterProfiles.json();
    console.log("🚀 ~ setProfile ~ response:", response);
  };

  const getProfile = async () => {
    const farcasterProfiles = await fetch("/api/getProfiles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await farcasterProfiles.json();
    setFarcasterProfiles(response.status);
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (data) {
    const filteredData = data.FarcasterCasts.Cast.filter(
      (item: Cast) =>
        item.text.includes("$DEGEN") || item.text.includes("$degen")
    );
    if (filteredData.length > 0) {
      console.log(filteredData);
      setProfile(filteredData);
    }
  }

  return (
    <div className="flex flex-col gap-3 items-center justify-center py-10 px-5 md:px-20">
      <h1 className="text-3xl font-medium text-sky-300">Profiler</h1>
      {loading && (
        <p className="text-xl text-neutral-200">Querying the data...</p>
      )}
      {error && <p className="text-xl text-red-500">Error: {error.message}</p>}
      <div className="mt-5 w-full h-full space-y-1 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[0.8fr_1fr_2fr_2fr] xl:grid-cols-[0.8fr_1fr_2fr_2fr] p-4 text-white bg-violet-600 gap-2 font-medium">
          <div className="capitalize">
            <p>FID</p>
          </div>
          <div className="capitalize">
            <span className="flex flex-row gap-2 items-center">
              Followers
              <button onClick={() => requestSort("followers")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  className="w-5 h-5"
                >
                  <path
                    fill="#FFD43B"
                    d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"
                  />
                </svg>
              </button>
            </span>
          </div>
          <div className="capitalize">
            <span className="flex flex-row gap-2 items-center">
              Followings
              <button onClick={() => requestSort("following")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  className="w-5 h-5"
                >
                  <path
                    fill="#FFD43B"
                    d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"
                  />
                </svg>
              </button>
            </span>
          </div>
          <div className="capitalize flex justify-end">
            <p>Address</p>
          </div>
        </div>
        {sortedProfiles.map((profile: any) => {
          return (
            <div
              key={profile.fid}
              className="grid grid-cols-[0.8fr_1fr_2fr_2fr] p-4 bg-[#E5E2DE]/90 text-[#2f2f2f] gap-0.5"
            >
              <div className="capitalize">
                <p>{profile.fid}</p>
              </div>
              <div className="capitalize">
                <p>{profile.followers}</p>
              </div>
              <div className="capitalize">
                <p>{profile.following}</p>
              </div>
              <div className="w-[6rem] md:w-full capitalize flex justify-end">
                <p className="truncate">{profile.address}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profiler;
