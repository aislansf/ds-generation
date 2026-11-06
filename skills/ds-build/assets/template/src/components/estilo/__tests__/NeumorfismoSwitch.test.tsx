import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NeumorfismoSwitch, { OpcaoSwitch } from "../NeumorfismoSwitch";

describe("NeumorfismoSwitch", () => {
  it("três cartões de estado com o gancho de switch e nome acessível pelo rótulo", () => {
    const { container } = render(<NeumorfismoSwitch />);
    expect(container.querySelectorAll('[data-ds="switch"]')).toHaveLength(3);
    for (const nome of ["Notificações Push", "Modo Alto Desempenho", "Sincronização 4G"]) {
      expect(screen.getByRole("switch", { name: nome })).toBeTruthy();
    }
    expect(container.querySelector(".neu-switch--secundaria")).not.toBeNull();
    expect(container.querySelectorAll(".neu-sw-card")).toHaveLength(3);
    expect(screen.getAllByText(/^(ON|OFF)$/)).toHaveLength(3);
    expect(container.querySelector(".neu-sw-chips")).toBeNull();
  });

  it("estados iniciais: dois ligados e um desligado", () => {
    render(<NeumorfismoSwitch />);
    expect(screen.getByRole("switch", { name: "Notificações Push" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("switch", { name: "Modo Alto Desempenho" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("switch", { name: "Sincronização 4G" }).getAttribute("aria-checked")).toBe("false");
  });

  it("clicar no rótulo alterna", () => {
    render(<NeumorfismoSwitch />);
    const sync = screen.getByRole("switch", { name: "Sincronização 4G" });
    fireEvent.click(screen.getByText("Sincronização 4G"));
    expect(sync.getAttribute("aria-checked")).toBe("true");
  });

  it("OpcaoSwitch desabilitada não muda ao clicar no rótulo", () => {
    render(<OpcaoSwitch rotulo="Recurso indisponível" desabilitado />);
    const chave = screen.getByRole("switch", { name: "Recurso indisponível" }) as HTMLButtonElement;
    expect(chave.disabled).toBe(true);
    fireEvent.click(screen.getByText("Recurso indisponível"));
    expect(chave.getAttribute("aria-checked")).toBe("false");
  });
});
