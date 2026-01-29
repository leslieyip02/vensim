import { useState } from "react";
import { LuClipboard, LuClipboardCheck, LuPlus, LuShare2 } from "react-icons/lu";

import { createRoom, joinRoom } from "@/actions/room";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { isGraphSocketConnected } from "@/sync/graph";

export function RoomModalView() {
    const [isOpen, setIsOpen] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    const alreadyJoined = isGraphSocketConnected();

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(isOpen) => {
                setIsCopied(false);
                setIsOpen(isOpen);
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="absolute bottom-8 right-8 z-100">
                    <LuShare2 />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Room</DialogTitle>
                    <DialogDescription>
                        Join an existing room or create a new one.
                    </DialogDescription>
                </DialogHeader>

                <FieldSet>
                    <Field>
                        <FieldLabel>Room ID</FieldLabel>
                        <div className="flex flex-row gap-2">
                            <Input
                                readOnly={alreadyJoined}
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Enter room ID"
                            />

                            {roomId ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            onClick={async () => {
                                                navigator.clipboard
                                                    .writeText(roomId)
                                                    .then(() => setIsCopied(true));
                                            }}
                                        >
                                            {isCopied ? <LuClipboardCheck /> : <LuClipboard />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{isCopied ? "Copied!" : "Copy"}</TooltipContent>
                                </Tooltip>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            disabled={!!roomId || alreadyJoined}
                                            onClick={async () => {
                                                const id = await createRoom();
                                                setRoomId(id);
                                            }}
                                        >
                                            <LuPlus />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Create room</TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </Field>
                </FieldSet>

                <DialogFooter className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button
                        disabled={!roomId || alreadyJoined}
                        onClick={async () => joinRoom(roomId).then(() => setIsOpen(false))}
                    >
                        {alreadyJoined ? "Joined!" : "Join Room"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
