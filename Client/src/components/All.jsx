import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Header from "./Header";
import "./All.css";
import { DotLoader } from "react-spinners";
import { toast } from "react-toastify";

const All = () => {
  const defaultUrl = "https://www.youtube.com/watch?v=c1GMcr2x4dI";
  const [videoUrl, setVideoUrl] = useState("");
  const [commentData, setCommentData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [borderColor, setBorderColor] = useState("border-gray-400");

  useEffect(() => {
    toast("Enter link with < 1 Million View", {autoClose: 4000});
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://sentiment-cyan.vercel.app/analyze",
          {
            url: defaultUrl,
          }
        );
        const dataForPieChart = [
          { name: "Positive Comments", value: response.data.positive_comments },
          { name: "Negative Comments", value: response.data.negative_comments },
        ];
        setPieChartData(dataForPieChart);
        setCommentData(response.data);
      } catch (error) {
        console.error("Error fetching default data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!videoUrl) {
      alert("Please enter a YouTube URL. ");
      return;
    }

    try {
      setVideoUrl("");
      const response = await axios.post(
        "https://sentiment-cyan.vercel.app/analyze",
        {
          url: videoUrl,
        }
      );

      // Transform the data for the Pie Chart
      const dataForPieChart = [
        { name: "Positive Comments", value: response.data.positive_comments },
        { name: "Negative Comments", value: response.data.negative_comments },
      ];

      setPieChartData(dataForPieChart);
      setCommentData(response.data);
    } catch (error) {
      console.error("Error sending URL to backend:", error);
    }
  };

  const handleFocus = () => {
    setBorderColor("border-red-700");
  };

  const handleBlur = () => {
    setBorderColor("border-gray-400");
  };

  const COLORS = ["#05c46b", "#f53b57"];

  return (
    <div>
      {loading ? (
        <div className="flex justify-center" style={{ marginTop: "17rem" }}>
          <DotLoader color="#182C61" size={100} />
        </div>
      ) : (
        <div>
          <Header />

          {/* Search Component */}
          <div className="search flex justify-center mt-8">
            <div
              className={`inner-search flex items-center bg-white rounded-full border ${borderColor} p-1`}
            >
              <input
                style={{ width: "35rem" }}
                placeholder="YouTube Link here..."
                className="input pl-5 h-10 text-base text-gray-900 rounded-full focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-base"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-base px-4 h-10"
                onClick={handleSubmit}
              >
                Search
              </button>
            </div>
          </div>

          {/* Main Component */}
          <div
            className="main-box flex justify-between items-center mt-10"
            style={{ paddingLeft: 80, paddingRight: 80 }}
          >
            {pieChartData.length > 0 && (
              <ResponsiveContainer width="40%" height={320} className="chart">
                <PieChart>
                  <Pie
                    className="pie"
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={(props) => props.innerRadius * 0.8}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" />
                </PieChart>
              </ResponsiveContainer>
            )}
            {commentData && (
              <div className="dark:bg-gray-700">
                <div className="mb-5 max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg">
                  <div className="comment-data border-b px-4 pb-6">
                    <div className="text-center">
                      <img
                        className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-2"
                        src={commentData.profile_picture_url}
                        alt=""
                      />

                      <div className="py-2">
                        <div className="flex justify-center items-center gap-1">
                          <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">
                            {commentData.channel}
                          </h3>
                        </div>
                        <div className="inline-flex text-gray-700 dark:text-gray-300 items-center">
                          <p className="text-md flex gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0.322-1.672V2.75a.75.75 0 0 1.75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0.745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                            </svg>
                            {commentData.total_likes}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-col">
                      <button className="mb-2 w-full rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2">
                        Total Comments: {commentData.total_comments}
                      </button>

                      <button className="mb-2 w-full rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold dark:text-white px-4 py-2 text-green-700 font-sans">
                        Positive Comments: {commentData.positive_comments}
                      </button>

                      <button className="mb-2 w-full rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-red-800 dark:text-white px-4 py-2 font-sans">
                        Negative Comments: {commentData.negative_comments}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default All;
