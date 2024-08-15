import * as toastr from "toastr";

export function configureToastr() {
    toastr.options.closeButton = true;
    toastr.options.timeOut = 5000;
    console.log("Toastr is configured");
}
