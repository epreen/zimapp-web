import Title from "@/components/ui/title";
import { Dispatch, SetStateAction } from "react";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Label } from "../label";

const priceArray = [
  { title: "Under MWK100000", value: "0-100000" },
  { title: "MWK100000 - MWK200000", value: "100000-200000" },
  { title: "MWK200000 - MWK300000", value: "200000-300000" },
  { title: "MWK300000 - MWK500000", value: "300000-500000" },
  { title: "Over MWK500000", value: "500000-10000000" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: Dispatch<SetStateAction<string | null>>;
}
const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Title className="text-base font-semibold text-foreground">
          Price Range
        </Title>
        <span className="text-xs text-foreground/60 bg-foreground/10 px-2 py-1 rounded-full">
          {priceArray.length}
        </span>
      </div>

      <RadioGroup className="space-y-1" value={selectedPrice || ""}>
        {priceArray?.map((price, index) => (
          <div
            key={index}
            onClick={() => setSelectedPrice(price?.value)}
            className="group flex items-center space-x-3 px-2 py-1 -mx-2 rounded-md cursor-pointer transition-colors duration-150"
          >
            <RadioGroupItem
              value={price?.value}
              id={price?.value}
              className="border-foreground/20 text-primary focus:ring-primary"
            />
            <Label
              htmlFor={price.value}
              className={`flex-1 cursor-pointer transition-colors duration-150 ${
                selectedPrice === price?.value
                  ? "font-medium text-primary"
                  : "text-foreground/80 group-hover:text-foreground/80"
              }`}
            >
              {price?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedPrice && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPrice(null);
          }}
          className="mt-4 text-xs font-medium text-foreground/60 hover:text-primary underline underline-offset-2 decoration-1 transition-colors duration-150"
        >
          Clear price filter
        </button>
      )}
    </div>
  );
};

export default PriceList;
