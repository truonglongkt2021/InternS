"use client";

import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { PaginationResponse, PaginationResponseSuccess } from "@/libs/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Pagination } from "@nextui-org/pagination";
import Link from "next/link";
import { formatedDate, formatedTimeToMinutes } from "@/app/util";
import {
  CalendarIcon,
  ScheduleIcon,
} from "@/app/(dashboard)/intern/_components/Icons";

interface InterViewScheduleInterface {
  id: string;
  title: string;
  interviewDate: string;
  startTime: string;
  timeDuration: string;
  interviewFormat: string;
  interviewLocation: string;
  createdByUserId: string;
  interviewerId: string;
}

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export default function InterViewCard() {
  const [pageIndex, setPageIndex] = useState(1);

  const pageSize = 6;

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["interviewSchedule", pageIndex, pageSize],
    queryFn: async () => {
      const response = await apiClient.get<
        PaginationResponse<InterViewScheduleInterface>
      >(API_ENDPOINTS.interviewSchedule, {
        params: new URLSearchParams({
          PageIndex: pageIndex.toString(),
          PageSize: pageSize.toString(),
        }),
      });

      if (response?.statusCode === "200") {
        const { data } =
          response as PaginationResponseSuccess<InterViewScheduleInterface>;

        return {
          interviewSchedules: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
        };
      }
    },
  });

  console.log(data);

  return (
    <div>
      <div className="grid h-full grid-cols-3 gap-5">
        {data?.interviewSchedules &&
          data.interviewSchedules.map(
            (interview: InterViewScheduleInterface) => (
              <Card key={interview.id as string} className="w-full">
                <CardHeader>
                  <div>
                    <div className="text-lg font-semibold">Lê Kỳ Quốc</div>
                    <div className="text-md mt-1">{interview.title}</div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="mb-2 grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      {" "}
                      <CalendarIcon className="mb-1" />
                      {formatedDate(interview.interviewDate)}
                    </div>
                    <div className="flex items-center gap-2">
                      <ScheduleIcon />
                      {interview.startTime}
                    </div>
                  </div>

                  <div className="mb-2 mt-1">
                    <span className="font-semibold">Duration: </span>
                    {formatedTimeToMinutes(interview.timeDuration)} mins
                  </div>
                  <div className="mb-2 mt-1 flex gap-2">
                    <span className="font-semibold">Interview format: </span>
                    <div className="text-blue-600">
                      {interview.interviewFormat}
                    </div>
                  </div>
                  <div className="mb-2 mt-1 flex gap-2">
                    <span className="font-semibold">Interview location: </span>

                    {interview.interviewFormat === "Online" ? (
                      <Link
                        href="http://localhost:3000"
                        className="text-blue-600 underline"
                      >
                        Link
                      </Link>
                    ) : (
                      interview.interviewLocation
                    )}
                  </div>
                  <div className="mb-2 mt-1">
                    <span>Created by: QKL</span>
                  </div>
                </CardBody>
              </Card>
            ),
          )}
      </div>

      <Pagination
        className="m-4 flex justify-center"
        isCompact
        loop
        showControls
        total={data?.totalPages ? Number(data.totalPages) : 0}
        initialPage={pageIndex}
        onChange={(page) => {
          setPageIndex(page);
        }}
      />
    </div>
  );
}
