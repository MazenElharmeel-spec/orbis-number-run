(() => {
  /** Canvas drawing and cosmic space visual effects for Orbis Number Run. */
  function createRenderer(canvas) {
    // alpha: true allows the CloudFront space video behind the canvas to show through seamlessly
    const context = canvas.getContext("2d", { alpha: true });
    const particles = [];
    const stars = [];

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let visualLane = 1;

    initStars();
    resize();
    window.addEventListener("resize", resize, { passive: true });

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < 70; i += 1) {
        stars.push({
          x: Math.random(),
          y: Math.random() * 0.45,
          size: 0.8 + Math.random() * 2,
          alpha: 0.2 + Math.random() * 0.7,
          twinkleSpeed: 1 + Math.random() * 3,
        });
      }
    }

    function resize() {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function lanePosition(lane, progress) {
      const spread = width * 0.17 + width * 0.29 * progress ** 2;
      return width / 2 + (lane - 1) * spread;
    }

    function roundedRectangle(x, y, rectangleWidth, rectangleHeight, radius) {
      context.beginPath();
      context.roundRect(x, y, rectangleWidth, rectangleHeight, radius);
    }

    function burstAtLane(lane, color = "#6FFF00") {
      const x = lanePosition(lane, 0.82);
      const y = height * 0.79;

      // Particle explosion
      for (let index = 0; index < 24; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 40 + Math.random() * 220;
        const isNeon = Math.random() > 0.4;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 20,
          size: 2 + Math.random() * 4,
          life: 0.8,
          maxLife: 0.8,
          color: isNeon ? color : "#00F0FF",
        });
      }

      // Energy expanding ring
      particles.push({
        x,
        y,
        isRing: true,
        radius: 6,
        maxRadius: 80,
        life: 0.6,
        maxLife: 0.6,
        color,
      });
    }

    function draw({ distance, gates, lane, state, dt, flash, shake }) {
      context.save();

      if (shake > 0) {
        context.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      }

      // Clear the canvas to allow the background video to show
      context.clearRect(0, 0, width, height);

      drawSpaceAtmosphere(distance);
      drawSpaceHighway(distance);

      for (const gate of [...gates].sort((first, second) => second.z - first.z)) {
        drawGate(gate, lane);
      }

      drawRunner(lane, state, dt);
      drawParticles(dt);

      if (flash > 0) {
        // Neon green success pulse
        context.fillStyle = `rgba(111, 255, 0, ${flash * 0.75})`;
        context.fillRect(0, 0, width, height);
      }

      context.restore();
    }

    function drawSpaceAtmosphere(distance) {
      const horizon = height * 0.32;

      // Subtle atmospheric starlight twinkle over the video
      const now = performance.now() * 0.002;
      for (const star of stars) {
        const twinkle = Math.sin(now * star.twinkleSpeed + star.x * 10) * 0.3 + 0.7;
        context.fillStyle = `rgba(239, 244, 255, ${star.alpha * twinkle * 0.75})`;
        context.beginPath();
        context.arc(star.x * width, star.y * horizon * 1.8, star.size, 0, Math.PI * 2);
        context.fill();
      }

      // Horizon atmospheric glow line
      const horizonGlow = context.createLinearGradient(0, horizon - 20, 0, horizon + 30);
      horizonGlow.addColorStop(0, "rgba(111, 255, 0, 0)");
      horizonGlow.addColorStop(0.4, "rgba(0, 240, 255, 0.15)");
      horizonGlow.addColorStop(0.6, "rgba(111, 255, 0, 0.22)");
      horizonGlow.addColorStop(1, "rgba(1, 8, 40, 0)");

      context.fillStyle = horizonGlow;
      context.fillRect(0, horizon - 20, width, 50);
    }

    function drawSpaceHighway(distance) {
      const horizon = height * 0.32;
      const trackTopLeft = width * 0.35;
      const trackTopRight = width * 0.65;
      const trackBottomLeft = width * 0.04;
      const trackBottomRight = width * 0.96;

      // Dark translucent glass runway hovering in space
      const runwayGradient = context.createLinearGradient(0, horizon, 0, height);
      runwayGradient.addColorStop(0, "rgba(1, 8, 40, 0.45)");
      runwayGradient.addColorStop(0.5, "rgba(2, 14, 52, 0.75)");
      runwayGradient.addColorStop(1, "rgba(1, 8, 40, 0.92)");

      context.fillStyle = runwayGradient;
      context.beginPath();
      context.moveTo(trackTopLeft, horizon);
      context.lineTo(trackTopRight, horizon);
      context.lineTo(trackBottomRight, height);
      context.lineTo(trackBottomLeft, height);
      context.closePath();
      context.fill();

      // Neon sleepers (moving light energy pulses across the track)
      drawLuminousSleepers(horizon, trackTopLeft, trackTopRight, trackBottomLeft, trackBottomRight, distance);

      // Glowing cosmic rails (outer neon green, inner cyan lane dividers)
      drawNeonRails(horizon, trackTopLeft, trackTopRight, trackBottomLeft, trackBottomRight);

      // Glowing runway edge beacons
      drawRunwayBeacons(horizon, trackTopLeft, trackTopRight, trackBottomLeft, trackBottomRight, distance);
    }

    function drawLuminousSleepers(horizon, topLeft, topRight, bottomLeft, bottomRight, distance) {
      const sleeperCount = 20;
      for (let index = 0; index < sleeperCount; index += 1) {
        const progress = (index / sleeperCount + (distance * 0.016) % 1) % 1;
        const perspective = progress ** 2.2;
        const y = horizon + (height - horizon) * perspective;
        const left = topLeft + (bottomLeft - topLeft) * perspective;
        const right = topRight + (bottomRight - topRight) * perspective;

        // Subtle neon sleeper line
        const alpha = 0.12 + 0.55 * progress;
        context.strokeStyle = `rgba(111, 255, 0, ${alpha * 0.65})`;
        context.lineWidth = 1 + progress * 7;
        context.beginPath();
        context.moveTo(left, y);
        context.lineTo(right, y);
        context.stroke();

        // High-energy central light bar
        context.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.4})`;
        context.lineWidth = 1 + progress * 2.5;
        context.beginPath();
        context.moveTo(left + (right - left) * 0.2, y);
        context.lineTo(left + (right - left) * 0.8, y);
        context.stroke();
      }
    }

    function drawNeonRails(horizon, topLeft, topRight, bottomLeft, bottomRight) {
      // 4 rail lines dividing the 3 lanes
      for (let laneIdx = 0; laneIdx <= 3; laneIdx += 1) {
        const pos = laneIdx / 3;
        const topX = topLeft + (topRight - topLeft) * pos;
        const bottomX = bottomLeft + (bottomRight - bottomLeft) * pos;
        const isOuter = laneIdx === 0 || laneIdx === 3;

        context.save();
        if (isOuter) {
          // Outer Neon Green Rails with intense glow
          context.shadowColor = "#6FFF00";
          context.shadowBlur = 16;
          context.strokeStyle = "rgba(111, 255, 0, 0.85)";
          context.lineWidth = 3.5;
          context.beginPath();
          context.moveTo(topX, horizon);
          context.lineTo(bottomX, height);
          context.stroke();

          // Core bright white-neon line
          context.shadowBlur = 0;
          context.strokeStyle = "#EFF4FF";
          context.lineWidth = 1.5;
          context.beginPath();
          context.moveTo(topX, horizon);
          context.lineTo(bottomX, height);
          context.stroke();
        } else {
          // Inner Lane Dividers (Electric Cyan dotted glow)
          context.shadowColor = "#00F0FF";
          context.shadowBlur = 8;
          context.strokeStyle = "rgba(0, 240, 255, 0.55)";
          context.lineWidth = 2;
          context.setLineDash([12, 14]);
          context.beginPath();
          context.moveTo(topX, horizon);
          context.lineTo(bottomX, height);
          context.stroke();
        }
        context.restore();
      }
    }

    function drawRunwayBeacons(horizon, topLeft, topRight, bottomLeft, bottomRight, distance) {
      for (let index = 0; index < 10; index += 1) {
        const progress = (index / 10 + distance * 0.015) % 1;
        const perspective = progress ** 2.2;
        const y = horizon + (height - horizon) * perspective;
        const left = topLeft + (bottomLeft - topLeft) * perspective;
        const right = topRight + (bottomRight - topRight) * perspective;
        const size = 3 + progress * 10;

        context.save();
        context.shadowColor = "#6FFF00";
        context.shadowBlur = 6 + progress * 12;

        // Left beacon
        context.fillStyle = `rgba(111, 255, 0, ${0.4 + 0.6 * progress})`;
        context.beginPath();
        context.arc(left - size * 1.5, y, size * 0.45, 0, Math.PI * 2);
        context.fill();

        // Right beacon
        context.beginPath();
        context.arc(right + size * 1.5, y, size * 0.45, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    function drawGate(gate, selectedLane) {
      const progress = 1 - Math.max(0, gate.z) / 1600;
      if (progress < 0 || progress > 1.1) return;

      const y = height * 0.32 + height * 0.68 * progress ** 2;
      const scale = 0.28 + 0.92 * progress;
      const leftLaneX = lanePosition(0, progress);
      const laneSpacing = (lanePosition(2, progress) - leftLaneX) / 2;

      for (let lane = 0; lane < 3; lane += 1) {
        const x = leftLaneX + laneSpacing * lane;
        const gateWidth = Math.max(82, Math.min(180, width * 0.32)) * scale;
        const gateHeight = 48 * scale;
        const isSelected = gate.chosen && gate.selected === lane;

        // Holographic vertical portal pillars
        drawPortalPillars(x, y, gateWidth, gateHeight, progress, isSelected);

        context.save();
        context.translate(x, y);

        // Liquid Glass Gate Body
        context.shadowColor = isSelected ? "#6FFF00" : "#00F0FF";
        context.shadowBlur = (isSelected ? 32 : 16) * scale;

        // Base rounded rect
        roundedRectangle(-gateWidth / 2, -gateHeight / 2, gateWidth, gateHeight, 10 * scale);

        // Glass background with subtle cosmic luminosity
        const glassGradient = context.createLinearGradient(0, -gateHeight / 2, 0, gateHeight / 2);
        if (isSelected) {
          glassGradient.addColorStop(0, "rgba(111, 255, 0, 0.45)");
          glassGradient.addColorStop(0.5, "rgba(111, 255, 0, 0.2)");
          glassGradient.addColorStop(1, "rgba(1, 8, 40, 0.85)");
        } else {
          glassGradient.addColorStop(0, "rgba(255, 255, 255, 0.18)");
          glassGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.04)");
          glassGradient.addColorStop(1, "rgba(1, 8, 40, 0.8)");
        }
        context.fillStyle = glassGradient;
        context.fill();

        // Liquid Glass gradient border
        context.lineWidth = Math.max(1.4, 2.4 * scale);
        const borderGradient = context.createLinearGradient(0, -gateHeight / 2, 0, gateHeight / 2);
        if (isSelected) {
          borderGradient.addColorStop(0, "#6FFF00");
          borderGradient.addColorStop(0.5, "rgba(111, 255, 0, 0.4)");
          borderGradient.addColorStop(1, "#6FFF00");
        } else {
          borderGradient.addColorStop(0, "rgba(255, 255, 255, 0.65)");
          borderGradient.addColorStop(0.2, "rgba(255, 255, 255, 0.2)");
          borderGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
          borderGradient.addColorStop(0.8, "rgba(0, 240, 255, 0.3)");
          borderGradient.addColorStop(1, "rgba(255, 255, 255, 0.6)");
        }
        context.strokeStyle = borderGradient;
        context.stroke();

        // Inner frosted plate
        roundedRectangle(
          -gateWidth / 2 + 4 * scale,
          -gateHeight / 2 + 4 * scale,
          gateWidth - 8 * scale,
          gateHeight - 8 * scale,
          7 * scale,
        );
        context.fillStyle = isSelected ? "rgba(1, 15, 60, 0.8)" : "rgba(1, 8, 40, 0.65)";
        context.fill();

        // Number Text in Anton font
        context.shadowBlur = isSelected ? 20 * scale : 6 * scale;
        context.shadowColor = isSelected ? "#6FFF00" : "#00F0FF";
        context.fillStyle = isSelected ? "#6FFF00" : "#EFF4FF";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `700 ${Math.max(16, 28 * scale)}px Anton, sans-serif`;
        context.fillText(String(gate.choices[lane].answer), 0, 1 * scale, gateWidth - 12 * scale);

        context.restore();
      }
    }

    function drawPortalPillars(x, y, gateWidth, gateHeight, progress, isSelected) {
      context.save();
      const beamHeight = Math.max(10, 42 * progress);
      const beamGrad = context.createLinearGradient(0, y + gateHeight * 0.4, 0, y + gateHeight * 0.4 + beamHeight);
      beamGrad.addColorStop(0, isSelected ? "rgba(111, 255, 0, 0.5)" : "rgba(0, 240, 255, 0.35)");
      beamGrad.addColorStop(1, "rgba(1, 8, 40, 0)");

      context.fillStyle = beamGrad;
      context.fillRect(
        x - gateWidth * 0.42,
        y + gateHeight * 0.4,
        gateWidth * 0.84,
        beamHeight,
      );
      context.restore();
    }

    /**
     * DRAW ORBIS — The cute astronaut in white spacesuit viewed from behind!
     * Perfectly recreates Orbis with glossy white helmet, cute chunky proportions,
     * life support backpack with glowing cyan LCD and colored LEDs, and natural running motion.
     */
    function drawRunner(lane, state, dt) {
      // Smooth lane transition with dynamic bank/lean angle
      visualLane += (lane - visualLane) * Math.min(1, dt * 14);
      const laneDelta = lane - visualLane;
      const bankAngle = Math.max(-0.2, Math.min(0.2, laneDelta * -0.22));

      const x = lanePosition(visualLane, 0.84);
      const y = height * 0.81;
      const scale = Math.min(1.6, Math.max(1.15, width / 560));
      const phase = performance.now() * 0.018;
      const bob = state === "playing" ? Math.abs(Math.sin(phase)) * 5 : 0;
      const stride = state === "playing" ? Math.sin(phase) * 9 : 0;

      context.save();
      context.translate(x, y);
      context.scale(scale, scale);
      context.rotate(bankAngle);

      // Soft ground shadow with subtle neon reflection
      context.save();
      context.fillStyle = "rgba(1, 4, 20, 0.65)";
      context.beginPath();
      context.ellipse(0, 32, 26 - bob * 0.8, 7 - bob * 0.3, 0, 0, Math.PI * 2);
      context.fill();

      // Faint neon green ambient ground bounce
      context.fillStyle = "rgba(111, 255, 0, 0.08)";
      context.beginPath();
      context.ellipse(0, 32, 32, 9, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();

      // Draw Orbis Character layers:
      // 1. Legs and Moon Boots
      drawOrbisLegs(bob, stride);

      // 2. Torso / Spacesuit body
      drawOrbisBody(bob);

      // 3. Life Support Backpack with glowing screen & LEDs
      drawOrbisBackpack(bob, state);

      // 4. Arms & Mittens
      drawOrbisArms(bob, stride);

      // 5. Astronaut Helmet & Ear Communicators
      drawOrbisHelmet(bob);

      context.restore();
    }

    function drawOrbisLegs(bob, stride) {
      const legY = 10 + bob;
      const leftFootX = -9 + stride * 0.9;
      const rightFootX = 9 - stride * 0.9;
      const footY = 27 + bob;

      // Legs (chubby white spacesuit)
      context.strokeStyle = "#EFF4FF";
      context.lineWidth = 10;
      context.lineCap = "round";
      context.lineJoin = "round";

      // Left leg
      context.beginPath();
      context.moveTo(-6, legY);
      context.lineTo(leftFootX, footY);
      context.stroke();

      // Right leg
      context.beginPath();
      context.moveTo(6, legY);
      context.lineTo(rightFootX, footY);
      context.stroke();

      // Left Boot
      drawBoot(leftFootX, footY, stride > 0);
      // Right Boot
      drawBoot(rightFootX, footY, stride < 0);
    }

    function drawBoot(x, y, isForward) {
      context.save();
      context.translate(x, y);

      // Boot sole (dark gray tread)
      context.fillStyle = "#334155";
      context.beginPath();
      context.roundRect(-6.5, 1, 13, 4.5, 2);
      context.fill();

      // Boot upper (chunky white space boot)
      const bootGrad = context.createLinearGradient(0, -5, 0, 2);
      bootGrad.addColorStop(0, "#FFFFFF");
      bootGrad.addColorStop(1, "#D0DBE5");
      context.fillStyle = bootGrad;
      context.beginPath();
      context.roundRect(-6, -5, 12, 7, 3);
      context.fill();

      // Boot cuff ring
      context.strokeStyle = "#94A3B8";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(-5, -4);
      context.lineTo(5, -4);
      context.stroke();

      context.restore();
    }

    function drawOrbisBody(bob) {
      context.save();
      const bodyY = -14 + bob;

      // Cute pear-shaped chubby white spacesuit torso
      const bodyGrad = context.createRadialGradient(2, bodyY + 12, 4, 0, bodyY + 14, 22);
      bodyGrad.addColorStop(0, "#FFFFFF");
      bodyGrad.addColorStop(0.65, "#E2E8F0");
      bodyGrad.addColorStop(1, "#CBD5E1");

      context.fillStyle = bodyGrad;
      context.beginPath();
      // Rounded chubby body
      context.roundRect(-15, bodyY, 30, 26, [8, 8, 12, 12]);
      context.fill();

      // Subtle horizontal waist seam
      context.strokeStyle = "rgba(148, 163, 184, 0.4)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(-13, bodyY + 23);
      context.lineTo(13, bodyY + 23);
      context.stroke();

      context.restore();
    }

    function drawOrbisBackpack(bob, state) {
      context.save();
      const packX = -12.5;
      const packY = -12 + bob;
      const packW = 25;
      const packH = 22;

      // Drop shadow from backpack onto suit
      context.shadowColor = "rgba(1, 8, 40, 0.4)";
      context.shadowBlur = 6;
      context.shadowOffsetY = 2;

      // Backpack main body (rounded white casing)
      const packGrad = context.createLinearGradient(0, packY, 0, packY + packH);
      packGrad.addColorStop(0, "#FFFFFF");
      packGrad.addColorStop(1, "#D8E2EC");
      context.fillStyle = packGrad;
      context.beginPath();
      context.roundRect(packX, packY, packW, packH, 5);
      context.fill();
      context.shadowColor = "transparent";

      // Backpack subtle rim border
      context.strokeStyle = "#94A3B8";
      context.lineWidth = 1;
      context.stroke();

      // 1. TOP-LEFT: Cyan illuminated LCD display panel
      context.fillStyle = "#031024";
      context.beginPath();
      context.roundRect(packX + 3.5, packY + 3.5, 7.5, 8.5, 1.5);
      context.fill();

      // Glowing cyan level bars inside LCD
      context.fillStyle = "#00F0FF";
      context.shadowColor = "#00F0FF";
      context.shadowBlur = 4;
      for (let bar = 0; bar < 3; bar += 1) {
        context.fillRect(packX + 4.5, packY + 4.5 + bar * 2.2, 5.5, 1.3);
      }
      context.shadowBlur = 0;

      // 2. TOP-CENTER: Circular knob with Green LED in center
      context.fillStyle = "#CBD5E1";
      context.beginPath();
      context.arc(packX + 15, packY + 6.5, 3.2, 0, Math.PI * 2);
      context.fill();

      // Bright neon green LED
      context.fillStyle = "#6FFF00";
      context.shadowColor = "#6FFF00";
      context.shadowBlur = 6;
      context.beginPath();
      context.arc(packX + 15, packY + 6.5, 1.6, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      // 3. TOP-RIGHT: Orange toggle switch / lever
      context.fillStyle = "#FF9E3B";
      context.shadowColor = "#FF9E3B";
      context.shadowBlur = 4;
      context.beginPath();
      context.roundRect(packX + 20, packY + 4, 2, 6, 1);
      context.fill();
      context.shadowBlur = 0;

      // 4. BOTTOM-LEFT: Vertical glowing indicator pill
      context.fillStyle = "#00F0FF";
      context.shadowColor = "#00F0FF";
      context.shadowBlur = 4;
      context.beginPath();
      context.roundRect(packX + 4.5, packY + 14, 2.5, 5, 1);
      context.fill();
      context.shadowBlur = 0;

      // 5. BOTTOM-RIGHT: Dual Status LEDs (Amber + Neon Green)
      // Amber LED
      context.fillStyle = "#FFB84D";
      context.shadowColor = "#FFB84D";
      context.shadowBlur = 4;
      context.beginPath();
      context.arc(packX + 14, packY + 16.5, 1.8, 0, Math.PI * 2);
      context.fill();

      // Green LED
      context.fillStyle = "#6FFF00";
      context.shadowColor = "#6FFF00";
      context.shadowBlur = 5;
      context.beginPath();
      context.arc(packX + 19, packY + 16.5, 1.8, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      // Thruster exhaust at bottom of backpack (tiny cyan plasma glow when running)
      if (state === "playing") {
        const exhaustPulse = Math.sin(performance.now() * 0.03) * 0.3 + 0.7;
        context.fillStyle = `rgba(0, 240, 255, ${0.45 * exhaustPulse})`;
        context.beginPath();
        context.ellipse(packX + 7, packY + packH + 1, 3, 2, 0, 0, Math.PI * 2);
        context.ellipse(packX + packW - 7, packY + packH + 1, 3, 2, 0, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    }

    function drawOrbisArms(bob, stride) {
      context.save();
      const armY = -10 + bob;

      // Arm strokes (swinging counter to leg stride)
      context.strokeStyle = "#EFF4FF";
      context.lineWidth = 7.5;
      context.lineCap = "round";

      // Left arm & mitten hand
      context.beginPath();
      context.moveTo(-13, armY);
      context.lineTo(-20 - stride * 0.45, armY + 14 - stride * 0.2);
      context.stroke();

      // Right arm & mitten hand
      context.beginPath();
      context.moveTo(13, armY);
      context.lineTo(20 + stride * 0.45, armY + 14 + stride * 0.2);
      context.stroke();

      // Left mitten cuff & hand
      context.fillStyle = "#CBD5E1";
      context.beginPath();
      context.arc(-20 - stride * 0.45, armY + 14 - stride * 0.2, 4.2, 0, Math.PI * 2);
      context.fill();

      // Right mitten cuff & hand
      context.beginPath();
      context.arc(20 + stride * 0.45, armY + 14 + stride * 0.2, 4.2, 0, Math.PI * 2);
      context.fill();

      context.restore();
    }

    function drawOrbisHelmet(bob) {
      context.save();
      const helmetY = -27 + bob;

      // Collar neck ring connecting helmet to suit
      context.fillStyle = "#CBD5E1";
      context.beginPath();
      context.roundRect(-10, helmetY + 11, 20, 5, 2.5);
      context.fill();

      // Left & Right cylindrical ear communication pods
      // Left ear pod
      const earGradLeft = context.createLinearGradient(-19, helmetY, -15, helmetY);
      earGradLeft.addColorStop(0, "#94A3B8");
      earGradLeft.addColorStop(0.5, "#EFF4FF");
      earGradLeft.addColorStop(1, "#CBD5E1");
      context.fillStyle = earGradLeft;
      context.beginPath();
      context.roundRect(-18.5, helmetY - 4, 4.5, 9, 2);
      context.fill();

      // Right ear pod
      const earGradRight = context.createLinearGradient(15, helmetY, 19, helmetY);
      earGradRight.addColorStop(0, "#CBD5E1");
      earGradRight.addColorStop(0.5, "#EFF4FF");
      earGradRight.addColorStop(1, "#94A3B8");
      context.fillStyle = earGradRight;
      context.beginPath();
      context.roundRect(14, helmetY - 4, 4.5, 9, 2);
      context.fill();

      // Right mini communicator antenna
      context.strokeStyle = "#94A3B8";
      context.lineWidth = 1.4;
      context.beginPath();
      context.moveTo(17, helmetY - 4);
      context.lineTo(20, helmetY - 11);
      context.stroke();
      // Antenna tip
      context.fillStyle = "#FFB84D";
      context.beginPath();
      context.arc(20, helmetY - 11, 1.8, 0, Math.PI * 2);
      context.fill();

      // Spherical white helmet dome
      const domeGrad = context.createRadialGradient(4, helmetY - 4, 3, 0, helmetY, 17);
      domeGrad.addColorStop(0, "#FFFFFF");
      domeGrad.addColorStop(0.55, "#F1F5F9");
      domeGrad.addColorStop(0.85, "#CBD5E1");
      domeGrad.addColorStop(1, "#94A3B8");

      context.fillStyle = domeGrad;
      context.beginPath();
      context.arc(0, helmetY, 14.5, 0, Math.PI * 2);
      context.fill();

      // Glossy specular highlight arc on helmet top-right
      context.strokeStyle = "rgba(255, 255, 255, 0.85)";
      context.lineWidth = 2.2;
      context.lineCap = "round";
      context.beginPath();
      context.arc(0, helmetY, 12, -Math.PI * 0.42, -Math.PI * 0.12);
      context.stroke();

      // Visor rim seam line
      context.strokeStyle = "rgba(148, 163, 184, 0.45)";
      context.lineWidth = 1;
      context.beginPath();
      context.arc(0, helmetY, 14.5, 0, Math.PI * 2);
      context.stroke();

      context.restore();
    }

    function drawParticles(dt) {
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.life -= dt;

        if (particle.life <= 0) {
          particles.splice(index, 1);
          continue;
        }

        const alpha = particle.life / particle.maxLife;

        if (particle.isRing) {
          // Expanding energy wave ring
          const currentRadius = particle.radius + (particle.maxRadius - particle.radius) * (1 - alpha);
          context.save();
          context.strokeStyle = particle.color;
          context.lineWidth = 2.5 * alpha;
          context.shadowColor = particle.color;
          context.shadowBlur = 14;
          context.beginPath();
          context.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);
          context.stroke();
          context.restore();
        } else {
          // Flying star sparks
          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;
          particle.vy += 80 * dt;

          context.save();
          context.globalAlpha = alpha;
          context.fillStyle = particle.color;
          context.shadowColor = particle.color;
          context.shadowBlur = 8;
          context.fillRect(particle.x, particle.y, particle.size, particle.size);
          context.restore();
        }
      }
    }

    return {
      burstAtLane,
      draw,
    };
  }

  window.NumberRunRenderer = { createRenderer };
})();
