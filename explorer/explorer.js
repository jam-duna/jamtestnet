// explorer.js
const rpcUrl = "http://localhost:9999/rpc";
const wsUrl = "ws://localhost:9999/ws";

// WebSocket receives Block Announcements
const ws = new WebSocket(wsUrl);

ws.addEventListener("open", () => {
  console.log("WebSocket connected.");
  // Optionally, send a subscription message if required:
  // ws.send(JSON.stringify({ jsonrpc: "2.0", method: "subscribe", params: [], id: 3 }));
});

ws.addEventListener("message", async (event) => {
  try {
    const msg = JSON.parse(event.data);
    if (
      msg.method === "BlockAnnouncement" &&
      msg.result &&
      msg.result.blockHash
    ) {
      //const blockHash = msg.result.blockHash;
      const headerHash = msg.result.headerHash;
      const block = await fetchBlock(headerHash);
      const state = await fetchState(headerHash);
      console.log(headerHash, block, state);

      if (block) {
        document.getElementById("blockContent").innerHTML = renderBlock(block);
      }
      if (state) {
        document.getElementById("stateContent").innerHTML = renderState(state);
      }
    }
  } catch (error) {
    console.error("Error processing WebSocket message:", error);
  }
});
ws.addEventListener("error", (err) => {
  console.error("WebSocket error:", err);
});

ws.addEventListener("close", (event) => {
  console.error("WebSocket closed", event);
});

// fetchBlock
async function fetchBlock(blockHash) {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "jam_getBlockByHash",
    params: [blockHash],
  };
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching block:", err);
  }
  return null;
}

async function fetchState(headerHash) {
  const payload = {
    jsonrpc: "2.0",
    id: 2,
    method: "jam_getState",
    params: [headerHash],
  };
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching state:", err);
  }
  return null;
}

// helper "show_..." functions.
function show_short_hex(hexStr) {
  if (!hexStr || typeof hexStr !== "string") return hexStr;
  if (hexStr.length < 16) return hexStr;
  const firstPart = hexStr.substring(0, 8);
  const lastPart = hexStr.substring(hexStr.length - 6);
  return firstPart + "..." + lastPart;
}

function show_epoch_mark(detailsStr) {
  try {
    const details = JSON.parse(detailsStr);
    alert("Epoch Mark Details:\n" + JSON.stringify(details, null, 2));
  } catch (e) {
    alert("Epoch Mark Details: " + detailsStr);
  }
}
function show_tickets(detailsStr) {
  try {
    const tickets = JSON.parse(detailsStr);
    alert("Tickets Details:\n" + JSON.stringify(tickets, null, 2));
  } catch (e) {
    alert("Tickets Details: " + detailsStr);
  }
}
function show_preimages(detailsStr) {
  try {
    const preimages = JSON.parse(detailsStr);
    alert("Preimages Details:\n" + JSON.stringify(preimages, null, 2));
  } catch (e) {
    alert("Preimages Details: " + detailsStr);
  }
}
function show_guarantees(detailsStr) {
  try {
    const guarantees = JSON.parse(detailsStr);
    alert("Guarantees Details:\n" + JSON.stringify(guarantees, null, 2));
  } catch (e) {
    alert("Guarantees Details: " + detailsStr);
  }
}
function show_assurances(detailsStr) {
  try {
    const assurances = JSON.parse(detailsStr);
    alert("Assurances Details:\n" + JSON.stringify(assurances, null, 2));
  } catch (e) {
    alert("Assurances Details: " + detailsStr);
  }
}
function show_beta(detailsStr) {
  try {
    const beta = JSON.parse(detailsStr);
    alert(
      "Beta Details (Count: " +
        beta.length +
        "):\n" +
        JSON.stringify(beta, null, 2)
    );
  } catch (e) {
    alert("Beta Details: " + detailsStr);
  }
}
function show_gamma_s(detailsStr) {
  try {
    const gamma_s = JSON.parse(detailsStr);
    alert(
      "Gamma_s Details (Count: " +
        gamma_s.tickets.length +
        "):\n" +
        JSON.stringify(gamma_s, null, 2)
    );
  } catch (e) {
    alert("Gamma_s Details: " + detailsStr);
  }
}
function show_current_pi(detailsStr) {
  try {
    const current = JSON.parse(detailsStr);
    alert(
      "Current Pi Details (Count: " +
        current.length +
        "):\n" +
        JSON.stringify(current, null, 2)
    );
  } catch (e) {
    alert("Current Pi Details: " + detailsStr);
  }
}
function show_workpackage(hash) {
  // Open the work package page in a new window/tab.
  window.open("/workpackage/" + hash, "_blank");
}

// renderBlock renders JSON as a single table.
function renderBlock(block) {
  if (!block) {
    return;
  }

  let html = "<table>";

  // --- Extrinsic rows (if present) ---
  if (block.extrinsic) {
    const extrinsic = block.extrinsic;
    const ticketsCount = extrinsic.tickets ? extrinsic.tickets.length : 0;
    if (ticketsCount > 0) {
      html += `<tr><th>Tickets (E_T)</th><td><span class="link" data-details='${JSON.stringify(
        extrinsic.tickets
      )}' onclick="show_tickets(this.dataset.details)">${ticketsCount}</span></td></tr>`;
    }
    const preimagesCount = extrinsic.preimages ? extrinsic.preimages.length : 0;
    if (preimagesCount > 0) {
      html += `<tr><th>Preimages (E_P)</th><td><span class="link" data-details='${JSON.stringify(
        extrinsic.preimages
      )}' onclick="show_preimages(this.dataset.details)">${preimagesCount}</span></td></tr>`;
    }
    const guaranteesCount = extrinsic.guarantees
      ? extrinsic.guarantees.length
      : 0;
    if (guaranteesCount > 0) {
      html += `<tr><th>Guarantees (E_G)</th><td><span class="link" data-details='${JSON.stringify(
        extrinsic.guarantees
      )}' onclick="show_guarantees(this.dataset.details)">${guaranteesCount}</span></td></tr>`;
    }
    const assurancesCount = extrinsic.assurances
      ? extrinsic.assurances.length
      : 0;
    if (assurancesCount > 0) {
      html += `<tr><th>Assurances (E_A)</th><td><span class="link" data-details='${JSON.stringify(
        extrinsic.assurances
      )}' onclick="show_assurances(this.dataset.details)">${assurancesCount}</span></td></tr>`;
    }
  }

  // --- Header rows ---
  if (block.header) {
    const header = block.header;
    html += `<tr><th>Parent</th><td>${
      header.parent ? show_short_hex(header.parent) : "N/A"
    }</td></tr>`;
    html += `<tr><th>Parent State Root</th><td>${
      header.parent_state_root
        ? show_short_hex(header.parent_state_root)
        : "N/A"
    }</td></tr>`;
    html += `<tr><th>Extrinsic Hash</th><td>${
      header.extrinsic_hash ? show_short_hex(header.extrinsic_hash) : "N/A"
    }</td></tr>`;
    html += `<tr><th>Slot</th><td>${header.slot || "N/A"}</td></tr>`;
    if (header.epoch_mark) {
      html += `<tr><th>Epoch Mark</th><td><span class="link" data-details='${JSON.stringify(
        header.epoch_mark
      )}' onclick="show_epoch_mark(this.dataset.details)">[Show Details]</span></td></tr>`;
    }
    html += `<tr><th>Author Index</th><td>${
      header.author_index !== undefined ? header.author_index : "N/A"
    }</td></tr>`;
    html += `<tr><th>Seal</th><td>${
      header.seal ? show_short_hex(header.seal) : "N/A"
    }</td></tr>`;
    html += `<tr><th>Offenders Mark</th><td>${
      header.offenders_mark ? JSON.stringify(header.offenders_mark) : "N/A"
    }</td></tr>`;
    html += `<tr><th>Tickets Mark</th><td>${
      header.tickets_mark ? JSON.stringify(header.tickets_mark) : "N/A"
    }</td></tr>`;
  }

  html += "</table>";
  return html;
}

// renderState: renders JSON state (from jam_getState) as a single table, with 1 row per attribute.
function renderState(state) {
  if (!state) {
    return;
  }
  let html = "<table>";
  if (state.alpha !== undefined) {
    html += `<tr><th>AuthorizationsPool (C1)</th><td><textarea class="ta ta_c1" rows="3">${JSON.stringify(
      state.alpha,
      null,
      2
    )}</textarea></td></tr>`;
  }
  if (state.varphi !== undefined) {
    html += `<tr><th>AuthorizationQueue (C2)</th><td><textarea class="ta ta_c2" rows="3">${JSON.stringify(
      state.varphi,
      null,
      2
    )}</textarea></td></tr>`;
  }
  if (state.beta !== undefined) {
    let betaCount = state.beta.length;
    html += `<tr><th>RecentBlocks (C3)</th><td>`;
    html += `<p><strong>Beta Count:</strong> <span class="link" data-details='${JSON.stringify(
      state.beta
    )}' onclick="show_beta(this.dataset.details)">${betaCount}</span></p>`;
    html += `<textarea class="ta ta_c3" rows="3">${JSON.stringify(
      state.beta,
      null,
      2
    )}</textarea>`;
    html += `</td></tr>`;
  }
  if (state.gamma !== undefined) {
    html += `<tr><th>SafroleBasicState (C4)</th><td>`;
    if (state.gamma.gamma_s !== undefined) {
      //let gammaS_Count = state.gamma.gamma_s.tickets.length;
      let gammaA_Count = state.gamma.gamma_a.length;
      html += `<p><strong>Ticket Accumulator:</strong> <span class="link" data-details='${JSON.stringify(
        state.gamma
      )}' onclick="show_gamma_s(this.dataset.details)">${gammaA_Count}</span></p>`;
    }
    html += `<textarea class="ta ta_c4" rows="3">${JSON.stringify(
      state.gamma,
      null,
      2
    )}</textarea>`;
    html += `</td></tr>`;
  }
  if (state.psi !== undefined) {
    html += `<tr><th>Disputes (C5)</th><td><textarea class="ta ta_c5" rows="3">${JSON.stringify(
      state.psi,
      null,
      2
    )}</textarea></td></tr>`;
  }
  if (state.eta !== undefined) {
    html += `<tr><th>Entropy (C6)</th><td><textarea class="ta ta_c6" rows="3">${JSON.stringify(
      state.eta,
      null,
      2
    )}</textarea></td></tr>`;
  }
  if (state.iota !== undefined) {
    html += `<tr><th>NextValidators (C7)</th><td><textarea class="ta ta_c7" rows="3">${JSON.stringify(
      state.iota,
      null,
      2
    )}</textarea></td></tr>`;
  }
  if (state.kappa !== undefined) {
    html += `<tr><th>CurrValidators (C8)</th><td><textarea class="ta ta_c8" rows="3">${JSON.stringify(
      state.kappa,
      null,
      2
    )}</textarea></td></tr>`;
  }
  if (state.lambda !== undefined) {
    html += `<tr><th>PrevValidators (C9)</th><td><textarea class="ta ta_c9" rows="3">${JSON.stringify(
      state.lambda,
      null,
      2
    )}</textarea></td></tr>`;
  }
  if (state.rho !== undefined) {
    html += `<tr><th>AvailabilityAssignments (C10)</th><td>`;
    // hack
    state.rho.forEach((item, i) => {
      if (
        item &&
        item.report &&
        item.report.package_spec &&
        item.report.package_spec.hash
      ) {
        document.getElementById(
          "core" + i
        ).innerHTML = `Core ${i}: <span class="link" onclick="show_workpackage('${item.report.package_spec.hash}')">${item.report.package_spec.hash}</span>`;
      }
    });
    html += `<textarea class="ta ta_c10" rows="3">${JSON.stringify(
      state.rho,
      null,
      2
    )}</textarea>`;
    html += `</td></tr>`;
  }
  if (state.tau !== undefined) {
    html += `<tr><th>Timeslot (C11)</th><td>${state.tau}</td></tr>`;
  }
  if (state.chi !== undefined) {
    // Row for C12: PrivilegedServiceIndices.
    html += `<tr><th>PrivilegedServiceIndices (C12)</th><td><textarea class="ta ta_c12" rows="3">${JSON.stringify(
      { chi_m: state.chi.chi_m, chi_a: state.chi.chi_a },
      null,
      2
    )}</textarea></td></tr>`;
  }
  if (state.pi !== undefined) {
    // Row for C13: ValidatorStatistics.
    html += `<tr><th>ValidatorStatistics (C13)</th><td><textarea class="ta ta_c13" rows="3">${JSON.stringify(
      state.pi,
      null,
      2
    )}</textarea></td></tr>`;
  }
  if (state.theta !== undefined) {
    html += `<tr><th>AccumulationQueue (C14)</th><td><textarea class="ta ta_c14" rows="3">${JSON.stringify(
      state.theta,
      null,
      2
    )}</textarea></td></tr>`;
  }
  if (state.xi !== undefined) {
    html += `<tr><th>AccumulationHistory (C15)</th><td><textarea class="ta ta_c15" rows="3">${JSON.stringify(
      state.xi,
      null,
      2
    )}</textarea></td></tr>`;
  }
  html += "</table>";
  return html;
}

// TODO: Immediately fetch latest state on page load
(async function init() {
  //const block = await fetchBlock("latest");
  //const state = await fetchState("latest");
  //updatePage(block, state)
})();
