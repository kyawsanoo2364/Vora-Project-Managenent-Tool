"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/modern-ui/dialog";
import { Label } from "@/components/modern-ui/label";
import { Flex, Spinner } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ColorPickButton from "./color-pick-button";
import { cn } from "@/libs/utils/helpers";
import { Input } from "@/components/modern-ui/input";
import { Textarea } from "@/components/modern-ui/textarea";
import { Button } from "@/components/modern-ui/button";
import z from "zod";
import { CreateBoardSchema } from "@/libs/schemas/create-board-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import { CREATE_BOARD } from "@/libs/utils/queryStringGraphql";
import toast from "react-hot-toast";

type FormData = z.infer<typeof CreateBoardSchema>;

const CreateBoardDialog = ({ workspaceId }: { workspaceId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedBgColor, setSelectedBgColor] = useState(
    "bg-gradient-to-r from-cyan-400 to-blue-500",
  );

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    reset,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(CreateBoardSchema),
    defaultValues: {
      background: selectedBgColor,
      name: "",
      description: undefined,
    },
  });

  useEffect(() => {
    if (selectedBgColor) {
      setValue("background", selectedBgColor);
    }
  }, [selectedBgColor]);

  const createBoardMutation = useMutation({
    mutationFn: async (data: FormData) =>
      await fetchWithAuth(CREATE_BOARD, {
        ...data,
        workspaceId,
      }),
    onSuccess: async () => {
      reset();
      toast.success("Created board successfully!");
      await queryClient.invalidateQueries({
        queryKey: ["boards", workspaceId],
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: FormData) => {
    createBoardMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="w-full h-32 bg-gray-600/40 rounded-md flex items-center justify-center cursor-pointer">
          <PlusIcon className="size-8 text-gray-400" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <Flex justify={"center"} direction={"row"} align={"center"}>
            <div
              className={cn(
                " w-52 h-32 rounded-sm relative",
                !selectedBgColor.includes("#") && selectedBgColor,
              )}
              style={
                selectedBgColor.includes("#")
                  ? {
                      backgroundColor: selectedBgColor,
                    }
                  : undefined
              }
            >
              <Image
                src={"/todo-skeleton.png"}
                alt="preview-show"
                fill
                className="object-contain"
              />
            </div>
          </Flex>
          <div className="my-4">
            <Label className="text-gray-400">Background</Label>
            <ColorPickButton
              onClick={setSelectedBgColor}
              selectedColor={selectedBgColor}
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-4">
              <Label className="text-gray-400">Name*</Label>
              <Input
                placeholder="Board Name"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="my-4">
              <Label className="text-gray-400">Description (optional)</Label>
              <Textarea
                placeholder="Description..."
                {...register("description")}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>
            <Button
              className={cn(
                "w-full bg-blue-500 text-white hover:scale-102 hover:bg-blue-600 transition duration-200 flex items-center justify-center gap-4",
                createBoardMutation.isPending &&
                  "cursor-not-allowed opacity-70",
              )}
              type="submit"
              disabled={createBoardMutation.isPending}
            >
              {createBoardMutation.isPending ? (
                <>
                  <Spinner size={"2"} /> <span>Creating...</span>
                </>
              ) : (
                "Create a board"
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardDialog;
