"use client";

import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../modern-ui/label";
import { Calendar28 } from "../calender28";
import { Button } from "../ui/button";

const DateContent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [isCheckedStartDate, setIsCheckedStartDate] = useState(false);
  const [isCheckedDueDate, setIsCheckedDueDate] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-medium text-center">Dates</h3>
      <div className="flex flex-col gap-2">
        <Label>Start Date</Label>
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            checked={isCheckedStartDate}
            onCheckedChange={() => setIsCheckedStartDate(!isCheckedStartDate)}
          />
          <Calendar28
            date={startDate}
            onDateChange={setStartDate}
            disabled={!isCheckedStartDate}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Due Date</Label>
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            checked={isCheckedDueDate}
            onCheckedChange={() => setIsCheckedDueDate(!isCheckedDueDate)}
          />
          <Calendar28
            date={dueDate}
            onDateChange={setDueDate}
            disabled={!isCheckedDueDate}
          />
        </div>
      </div>
      <Button className="bg-blue-500 text-white hover:bg-blue-600">Save</Button>
    </div>
  );
};

export default DateContent;
