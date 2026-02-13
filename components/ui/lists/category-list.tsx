import { Dispatch, SetStateAction } from "react";
import { Category } from "@/sanity.types";
import Title from "@/components/ui/title";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Label } from "../label";
interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: Dispatch<SetStateAction<string | null>>;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Title className="text-base font-semibold text-foreground">
          Categories
        </Title>
        <span className="text-xs text-foreground/60 bg-foreground/10 px-2 py-1 rounded-full">
          {categories?.length || 0}
        </span>
      </div>

      <RadioGroup value={selectedCategory || ""} className="space-y-1">
        {categories?.map((category) => (
          <div
            key={category?._id}
            onClick={() =>
              setSelectedCategory(category?.slug?.current as string)
            }
            className="group flex items-center space-x-3 px-2 py-1 -mx-2 rounded-md cursor-pointer transition-colors duration-150"
          >
            <RadioGroupItem
              value={category?.slug?.current as string}
              id={category?.slug?.current}
              className="border-foreground/20 text-primary focus:ring-primary"
            />
            <Label
              htmlFor={category?.slug?.current}
              className={`flex-1 cursor-pointer transition-colors duration-150 ${
                selectedCategory === category?.slug?.current
                  ? "font-medium text-primary"
                  : "text-foreground/70 group-hover:text-foreground/80"
              }`}
            >
              {category?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedCategory && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCategory(null);
          }}
          className="mt-4 text-xs font-medium text-foreground/60 hover:text-primary underline underline-offset-2 decoration-1 transition-colors duration-150"
        >
          Clear category filter
        </button>
      )}
    </div>
  );
};

export default CategoryList;
