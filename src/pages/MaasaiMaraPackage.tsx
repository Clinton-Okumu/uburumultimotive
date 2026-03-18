import { Link } from "react-router-dom";
import MaasaiMaraPackageDetails from "../components/UburuVillageComponents/MaasaiMaraPackageDetails";

const MaasaiMaraPackage = () => {
  return (
    <div>
      <section className="bg-[#0f2b41] px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/get/village"
            className="text-xs font-black uppercase tracking-[0.2em] text-[#f2c15d]"
          >
            Back to Uburu Village
          </Link>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">Maasai Mara Migration Season</h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-white/80">
            Full package details, pricing matrix, and checkout options.
          </p>
        </div>
      </section>
      <MaasaiMaraPackageDetails />
    </div>
  );
};

export default MaasaiMaraPackage;
