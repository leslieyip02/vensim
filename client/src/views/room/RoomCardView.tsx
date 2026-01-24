import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import { createRoom, joinRoom } from "@/actions/room";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function RoomCardView() {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [inputBuffer, setInputBuffer] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(true);

    if (roomId) {
        return (
            <Card className="w-sm py-4 z-100 border-b bg-background drop-shadow rounded-md">
                <CardTitle className="px-6 flex flex-row items-center justify-between">
                    Room {roomId}
                </CardTitle>
            </Card>
        );
    }

    return (
        <Card className="w-sm py-4 z-100 border-b bg-background drop-shadow rounded-md">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-2">
                <CollapsibleTrigger>
                    <CardTitle className="px-6 flex flex-row items-center justify-between">
                        Room Management
                        <Button variant="ghost" className="bg-transparent">
                            {isOpen ? <LuChevronUp /> : <LuChevronDown />}
                        </Button>
                    </CardTitle>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel>Room ID</FieldLabel>
                                        <Input
                                            value={inputBuffer}
                                            onChange={(e) => setInputBuffer(e.target.value)}
                                        />
                                    </Field>
                                </FieldGroup>
                            </FieldSet>
                            <Field orientation="horizontal">
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        const roomId = await createRoom();
                                        joinRoom(roomId);
                                        setRoomId(roomId);
                                    }}
                                >
                                    Create Room
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        joinRoom(inputBuffer);
                                        setRoomId(inputBuffer);
                                    }}
                                >
                                    Join Room
                                </Button>
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
