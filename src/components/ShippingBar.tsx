import { Truck, IndianRupee, Headphones } from "lucide-react";

export function ShippingBar() {
  return (
    <section className="py-8 sm:py-10 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Free Shipping</h3>
              <p className="text-xs text-muted-foreground">On Orders Above ₹249</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">COD Available</h3>
              <p className="text-xs text-muted-foreground">@ ₹30 Per Order</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">24/7 Support</h3>
              <p className="text-xs text-muted-foreground">WhatsApp & Call Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
