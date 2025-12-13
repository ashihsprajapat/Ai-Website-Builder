import {
  AccountSettingsCards,
  ChangePasswordCard,
} from "@daveyplate/better-auth-ui";
import { DeleteAccountCard } from "@daveyplate/better-auth-ui";

const Setting = () => {
  return (
    <div className=" w-full p-4 flex justify-center items-center min-h-[90vh] flex-col gap-6 py-12">
      <AccountSettingsCards
        classNames={{
          card: {
            base: "bg-black/10 ring ring-indigo-950 max-w-xl mx-auto",
            footer: " bg-black/10 ring ring-indigo-950 ",
          },
        }}
      />
      <div className=" w-full ">
        <ChangePasswordCard
          classNames={{
            base: "bg-black/10 ring ring-indigo-950 max-w-xl mx-auto",
            footer: " bg-black/10 ring ring-indigo-950 ",
          }}
        />
      </div>
      <div className="flex w-full flex-col gap-6">
        <DeleteAccountCard
          classNames={{
            base: "bg-black/10 ring ring-indigo-950 max-w-xl mx-auto",
            footer: " bg-black/10 ring ring-indigo-950 ",
          }}
        />
      </div>
    </div>
  );
};

export default Setting;
