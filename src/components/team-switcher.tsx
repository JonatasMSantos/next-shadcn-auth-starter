"use client";

import * as React from "react";

import { useSession } from "next-auth/react";

import { CheckIcon, Loader2, PlusCircleIcon, SortDescIcon } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { Skeleton } from "./ui/skeleton";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type TeamSwitcherProps = PopoverTriggerProps;

type Organization = {
  id: string;
  imageUrl: string;
  name: string;
};

export function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [isSettingOrganization, setIsSettingOrganization] = useState(false);

  const organizationList: Organization[] = [
    {
      id: "1",
      imageUrl: "https://jonatas.works/favicon.ico",
      name: "Jônatas Teams",
    },
  ];

  let currentOrganization = organizationList[0];
  let isCurrentOrganizationLoaded = true;
  let isLoading = false;

  function handleCreateTeam() {}

  function setCurrentOrganization(organization: any) {
    currentOrganization = organization;
  }

  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return <></>;
  }

  const user = session!.user;

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger disabled asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] items-center gap-2", className)}
            disabled={!isCurrentOrganizationLoaded}
          >
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-5 rounded-full bg-primary/30" />
                <Skeleton className="h-3 w-32 bg-primary/30" />
              </>
            ) : !currentOrganization ? (
              <>
                <Avatar className="h-5 w-5">
                  {user.image ? <AvatarImage src={user.image} /> : <></>}
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {user.name ?? "Personal"}
                </span>
              </>
            ) : (
              <>
                <Avatar className="h-5 w-5">
                  <AvatarImage src={currentOrganization.imageUrl} />
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {currentOrganization.name}
                </span>
              </>
            )}
            {isSettingOrganization ? (
              <Loader2 className="ml-auto h-4 w-4 shrink-0 animate-spin opacity-30" />
            ) : (
              <SortDescIcon className="ml-auto h-4 w-4 shrink-0 opacity-50"></SortDescIcon>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading="Personal">
                <CommandItem
                  onSelect={() => setCurrentOrganization(null)}
                  className="gap-2"
                >
                  <Avatar className="h-5 w-5">
                    {user.image ? <AvatarImage src={user.image} /> : <></>}
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {user.name}
                  </span>
                  {currentOrganization === null && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Teams">
                {organizationList?.map((organization) => {
                  return (
                    <CommandItem
                      onSelect={() => setCurrentOrganization(organization.id)}
                      key={organization.id}
                      className="gap-2"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={organization.imageUrl} />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {organization.name}
                      </span>
                      {organization.id === currentOrganization?.id && (
                        <CheckIcon className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    className="gap-2 py-2 text-xs"
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircleIcon className="h-4 w-4" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage services and events.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateTeam}>
          <div>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team name</Label>
                <Input name="name" id="name" placeholder="Acme Inc." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewTeamDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
