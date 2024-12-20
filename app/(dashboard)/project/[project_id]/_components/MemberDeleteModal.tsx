import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import React from "react";
import { TrashIcon } from "@/components/icons/OtherIcons";
import { deleteMember } from "@/actions/delete-member";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export type MemberDeleteModalProps = {
  projectId: string;
  memberId: string;
};

export default function MemberDeleteModal(props: MemberDeleteModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();

  return (
    <>
      <Button onClick={onOpen} isIconOnly variant="light">
        <TrashIcon size={16} />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-[800px]">
        <ModalContent className="">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="">Delete Member</h1>
              </ModalHeader>
              <ModalBody className="">
                <h1>Are you sure you want to delete this member?</h1>
              </ModalBody>

              <ModalFooter>
                <Button
                  onClick={() => {
                    deleteMember(props.projectId, props.memberId);
                    toast.success("Member deleted successfully");
                    queryClient.invalidateQueries();
                    onClose();
                  }}
                  fullWidth
                  variant="shadow"
                  color="danger"
                >
                  Delete
                </Button>
                <Button fullWidth onPress={() => onClose()}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
