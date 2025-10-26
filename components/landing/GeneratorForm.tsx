"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UploadCloud } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { z } from "zod";

import { FadeItem, FadeStagger } from "../animations";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";

const schema = z.object({
  productName: z.string().min(2, "Add a product name"),
  description: z.string().min(10, "Add a short description"),
  template: z.string().min(1, "Pick a template"),
});

type FormValues = z.infer<typeof schema>;

export function GeneratorForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      productName: "",
      description: "",
      template: "saas",
    },
    mode: "onBlur",
  });

  const { handleSubmit, register, setValue, formState } = form;

  const isSubmitting = formState.isSubmitting;

  const onDrop = useMemo(
    () =>
      (accepted: File[]) => {
        if (!accepted.length) return;
        setValue("productName", accepted[0].name.replace(/\.[^/.]+$/, ""));
        toast.success("Brand assets uploaded", {
          description: `${accepted[0].name} ready to use in your template`,
        });
      },
    [setValue]
  );

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Template generated", {
      description: `${values.productName} landing page is ready to preview`,
    });
  };

  return (
    <section className="section generator" aria-labelledby="generator-title" data-surface="glass" data-width="split">
      <div className="generator__layout">
        <FadeStagger className="generator__stagger">
          <FadeItem>
            <div className="section__header">
              <h2 id="generator-title">Kickstart a page in under a minute</h2>
              <p>Drop in context, choose a template, and we’ll assemble a production-ready draft.</p>
            </div>
          </FadeItem>
          <FadeItem>
            <form className="generator__form" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="productName">Product name</label>
              <Input id="productName" placeholder="Orbit Analytics" {...register("productName")} error={formState.errors.productName?.message} />
              <label htmlFor="description">Describe your offer</label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Give Promptify a quick overview of what you’re launching, your audience, and desired outcome."
              {...register("description")}
              error={formState.errors.description?.message}
            />
            <label htmlFor="template">Template style</label>
            <Select id="template" {...register("template")} defaultValue="saas" error={formState.errors.template?.message}>
              <option value="saas">SaaS metrics</option>
              <option value="agency">Agency portfolio</option>
              <option value="ecommerce">Ecommerce launch</option>
            </Select>
            <Dropzone onDrop={onDrop} maxFiles={1} multiple={false} accept={{ "image/*": [] }}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                  className={`upload-zone${isDragActive ? " is-active" : ""}`}
                  {...getRootProps({ role: "button", tabIndex: 0 })}
                >
                  <input {...getInputProps()} aria-label="Upload brand assets" />
                  <UploadCloud aria-hidden />
                  <div>
                    <strong>Upload brand assets</strong>
                    <p className="small">Logo, palette, or screenshots — optional but helps personalization.</p>
                  </div>
                </div>
              )}
            </Dropzone>
            <div className="generator__actions">
              <Button size="lg" type="submit" loading={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="spinner" aria-hidden /> Generating...
                  </>
                ) : (
                  "Generate your page"
                )}
              </Button>
              <Button type="button" variant="ghost" size="lg">
                Try sample template
              </Button>
            </div>
              {formState.errors.root ? (
                <p role="alert" className="field__message">
                  {formState.errors.root.message}
                </p>
              ) : null}
            </form>
          </FadeItem>
        </FadeStagger>
      </div>
    </section>
  );
}
