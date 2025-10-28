"use client";

import { useLocalStorage } from "@/hooks/use-localstorage";
import { CreateWorkspaceFormSchema } from "@/libs/schemas/create-workspace-form.schema";
import { fetchWithAuth } from "@/libs/utils/fetchWithAuth";
import {
  CREATE_WORKSPACE_MUTATION,
  GET_ALL_MY_WORKSPACE,
} from "@/libs/utils/queryStringGraphql";
import { uploadFile } from "@/libs/utils/uploadFile";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DropdownMenu,
  Flex,
  ScrollArea,
  Skeleton,
  Spinner,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  CheckCheckIcon,
  CircleXIcon,
  LayoutPanelTopIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

type FormData = z.infer<typeof CreateWorkspaceFormSchema>;

const WorkspaceDropdownMenu = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [getDefaultWorkspaceId, setDefaultWorkspaceId] = useLocalStorage<
    string | null
  >("vora_workspace_id", null);
  const [currentWorkspace, setCurrentWorkSpace] = useState<any | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadLogoError, setUploadLogoError] = useState<string | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const [isOpenCreateWorkspaceModel, setIsOpenCreateWorkSpaceModel] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(CreateWorkspaceFormSchema),
    defaultValues: {
      name: "",
      description: null,
      logo: null,
    },
  });

  useEffect(() => {
    if (getDefaultWorkspaceId && pathname === "/home") {
      router.push(`/home/workspace/${getDefaultWorkspaceId}`);
    }
  }, []);

  useEffect(() => {
    if (watch().name !== "" || watch().description || previewLogo) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [watch().name, watch().description, previewLogo]);

  useEffect(() => {
    const unloadFunction = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    if (isFormDirty) {
      window.addEventListener("beforeunload", unloadFunction);
    }

    return () => window.removeEventListener("beforeunload", unloadFunction);
  }, [isFormDirty]);

  const getAllWorkspace = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => await fetchWithAuth(GET_ALL_MY_WORKSPACE),
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: async (data: FormData) =>
      await fetchWithAuth(CREATE_WORKSPACE_MUTATION, { ...data }),
    onSuccess: async (data) => {
      reset();
      setIsOpenCreateWorkSpaceModel(false);
      cancleLogoPreview();
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("New Workspace created successfully!");
      setDefaultWorkspaceId(data.createWorkspace.id);
      router.push(`/home/workspace/${data.createWorkspace.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onFileChangeLogo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const decodedFile = URL.createObjectURL(file);
    setPreviewLogo(decodedFile);

    try {
      setIsUploadingLogo(true);
      setUploadLogoError(null);
      const data = await uploadFile(file);

      setValue("logo", data.data.fileId);
    } catch (error: any) {
      toast.error(error.message);
      setUploadLogoError(error.message);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const cancleLogoPreview = () => {
    setPreviewLogo(null);
    setUploadLogoError(null);
  };

  const createWorkspaceSubmit = async (data: FormData) => {
    await createWorkspaceMutation.mutateAsync(data);
    return;
  };

  useEffect(() => {
    if (
      getDefaultWorkspaceId &&
      getAllWorkspace.data?.get_all_my_workspaces?.length > 0
    ) {
      const workspaceData = getAllWorkspace.data.get_all_my_workspaces.find(
        (data: any) => data.id === getDefaultWorkspaceId,
      );

      setCurrentWorkSpace(workspaceData);
    }
  }, [getAllWorkspace.data?.get_all_my_workspaces]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline">
          {getAllWorkspace.isLoading ? (
            <div className="flex items-center w-full gap-3">
              <Skeleton width={"20px"} height={"20px"} />
              <Skeleton width={"40px"} height={"20px"} />
            </div>
          ) : currentWorkspace ? (
            <div className="flex flex-row items-center gap-3">
              {currentWorkspace.logo?.url && (
                <Image
                  src={currentWorkspace.logo.url}
                  width={20}
                  height={20}
                  alt="workspace_logo"
                  className="rounded-md object-cover size-[15px] md:size-[20px]"
                />
              )}
              <p className="truncate max-w-[40px]  md:max-w-[140px]">
                {currentWorkspace.name}
              </p>
            </div>
          ) : (
            "Select Workspace"
          )}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-62 h-fit max-h-52 overflow-y-auto">
        <h3 className="text-sm font-medium">Workspaces</h3>
        {/** No found workspace ui */}
        {!getAllWorkspace.isLoading &&
          getAllWorkspace.data?.get_all_my_workspaces?.length <= 0 && (
            <div className="w-full mb-4 h-full flex flex-col gap-2 items-center justify-center mt-10">
              <LayoutPanelTopIcon className="size-9 text-slate-500" />
              <p className="text-base font-semibold text-slate-500 text-center">
                No workspace yet.
              </p>
            </div>
          )}
        <Box my={"4"}>
          <ScrollArea scrollbars="vertical" style={{ height: 100 }}>
            {getAllWorkspace.isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <DropdownMenu.Item key={i}>
                    <div className="flex items-center gap-3 w-full">
                      <Skeleton width={"20px"} height={"20px"} />
                      <Skeleton height={"20px"} width={"100%"} />
                    </div>
                  </DropdownMenu.Item>
                ))
              : getAllWorkspace?.data?.get_all_my_workspaces?.map(
                  (data: any, i: number) => (
                    <DropdownMenu.Item
                      key={data.id}
                      onClick={() => {
                        setDefaultWorkspaceId(data.id);
                        setCurrentWorkSpace(data);
                        router.push(`/home/workspace/${data.id}`);
                      }}
                      className="group"
                    >
                      {data?.logo?.url && (
                        <Image
                          src={data.logo.url}
                          alt={data.name}
                          width={40}
                          height={40}
                          className="rounded-md size-[20px] object-cover"
                        />
                      )}
                      <p className="line-clamp-1">{data.name}</p>
                      {currentWorkspace?.id === data.id && (
                        <CheckCheckIcon className="size-4 text-blue-500 group-hover:text-white" />
                      )}
                    </DropdownMenu.Item>
                  ),
                )}
          </ScrollArea>
        </Box>
        {/** Create workspace button */}
        <Dialog.Root
          onOpenChange={() => {
            reset();
            setPreviewLogo(null);
            setUploadLogoError(null);
            setIsOpenCreateWorkSpaceModel(!isOpenCreateWorkspaceModel);
          }}
          open={isOpenCreateWorkspaceModel}
        >
          <Dialog.Trigger>
            <Button>Create A Workspace</Button>
          </Dialog.Trigger>
          <Dialog.Content maxWidth={"450px"} style={{ position: "relative" }}>
            <Dialog.Title>Create A Workspace</Dialog.Title>
            <Dialog.Close
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                cursor: "pointer",
              }}
              className="hover:bg-gray-300/20 p-2 rounded-full text-slate-300"
            >
              <XIcon className="size-9" />
            </Dialog.Close>
            <Dialog.Description>
              Workspace keeps your team organized and projects on track with
              smart tools and insights.
            </Dialog.Description>
            <form
              className="mt-4"
              onSubmit={handleSubmit(createWorkspaceSubmit)}
            >
              <Flex direction={"column"} gap={"3"}>
                <label>
                  <Text as="div" size={"2"} mb={"1"} weight={"bold"}>
                    Name (required)*
                  </Text>
                  <TextField.Root
                    placeholder="Enter workspace name"
                    {...register("name", { required: true })}
                  />
                  {errors.name && (
                    <Text as="span" size={"1"} weight={"regular"} color="red">
                      {errors.name?.message}
                    </Text>
                  )}
                </label>
                <label>
                  <Text as="div" size={"2"} mb="1" weight={"bold"}>
                    Description (optional)
                  </Text>
                  <TextArea
                    size={"3"}
                    placeholder="Workspace Description..."
                    {...register("description")}
                  />
                  {errors.description && (
                    <Text as="span" size={"1"} weight={"regular"} color="red">
                      {errors.description?.message}
                    </Text>
                  )}
                </label>
                <div>
                  <Text as="div" size={"2"} mb="1" weight={"bold"}>
                    Logo (optional)
                  </Text>
                  {previewLogo ? (
                    <div className="relative size-32 ">
                      <Image
                        src={previewLogo}
                        alt="preview logo"
                        className="rounded-md object-cover"
                        fill
                      />
                      {isUploadingLogo && (
                        <div className="absolute inset-0 bg-gray-700/50 rounded-md flex flex-col items-center justify-center">
                          <Spinner size={"3"} />
                        </div>
                      )}
                      {uploadLogoError && (
                        <div className="absolute inset-0 rounded-md bg-black/70 flex items-center flex-col justify-center">
                          <div className="absolute top-0 -right-1">
                            <button
                              type="button"
                              style={{ cursor: "pointer" }}
                              className="hover:bg-gray-500/20 rounded-full p-2"
                              onClick={cancleLogoPreview}
                            >
                              <XIcon className="size-6" />
                            </button>
                          </div>
                          <CircleXIcon className="size-10 text-red-400" />
                          <p className="text-red-400">Failed!</p>
                          <p className="text-sm text-red-400">
                            Please try again!
                          </p>
                        </div>
                      )}
                      {!isUploadingLogo && !uploadLogoError && (
                        <button className="absolute top-0 right-0 hover:bg-red-500 p-2 rounded-md hover:text-white text-red-500 bg-gray-300/10 cursor-pointer ">
                          <Trash2Icon className="size-4 " />
                        </button>
                      )}
                    </div>
                  ) : (
                    <label>
                      <div className="w-full h-32 bg-blue-500/10 rounded-md flex items-center justify-center cursor-pointer">
                        <PlusIcon className="size-10 text-slate-600" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={onFileChangeLogo}
                        />
                      </div>
                    </label>
                  )}
                </div>

                <Button
                  disabled={
                    createWorkspaceMutation.isPending || isUploadingLogo
                  }
                  size={"3"}
                  style={
                    createWorkspaceMutation.isPending || isUploadingLogo
                      ? { cursor: "not-allowed" }
                      : { cursor: "pointer" }
                  }
                  type="submit"
                >
                  {createWorkspaceMutation.isPending ? (
                    <>
                      <Spinner /> Creating...
                    </>
                  ) : (
                    "Create A Workspace"
                  )}
                </Button>
              </Flex>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default WorkspaceDropdownMenu;
