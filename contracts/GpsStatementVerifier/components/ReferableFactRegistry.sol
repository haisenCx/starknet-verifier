/*
  Copyright 2019-2023 StarkWare Industries Ltd.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  https://www.starkware.co/open-source-license/

  Unless required by applicable law or agreed to in writing,
  software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions
  and limitations under the License.
*/
// SPDX-License-Identifier: Apache-2.0.
pragma solidity ^0.6.12;

import "./FactRegistry.sol";
import "../libraries/Addresses.sol";

/*
  ReferableFactRegistry extends FactRegistry,
  so that it can be deployed with a reference FactRegistry.
  The reference FactRegistry is used as a secondary fact registry.
  When the contract is queried for fact validity using isValid(),
  if the queried fact is not in the local fact registry, the call is passed to the reference.

  The reference FactRegistry is active only for a pre-defined duration (in seconds).
  After that duration expires, the reference FactRegistry can not be queried anymore.
*/
contract ReferableFactRegistry is FactRegistry {
    IFactRegistry public referenceFactRegistry;
    uint256 public referralExpirationTime;

    using Addresses for address;

    constructor(address refFactRegistry, uint256 referralDurationSeconds) public {
        // Allow 0 address, i.e. no referral.
        if (refFactRegistry != address(0)) {
            referenceFactRegistry = IFactRegistry(refFactRegistry);
            // NOLINTNEXTLINE: no-block-members.
            referralExpirationTime = block.timestamp + referralDurationSeconds;
            require(referralExpirationTime >= block.timestamp, "DURATION_WRAP_AROUND");
            require(refFactRegistry.isContract(), "REFERENCE_NOT_CONTRACT");
            require(refFactRegistry != address(this), "SELF_ASSIGNMENT");

            // NOLINTNEXTLINE: reentrancy-benign no-low-level-calls.
            (bool success,) = refFactRegistry.staticcall(
                abi.encodeWithSelector(IFactRegistry(refFactRegistry).isValid.selector, bytes32(0x0))
            );
            require(success, "REFERENCE_NOT_FACT_REGISTRY");
        }
    }

    /*
      Checks if a fact was registered.
    */
    function isValid(bytes32 fact) external view virtual override returns (bool) {
        if (internalIsValid(fact)) {
            return true;
        }
        return isValidOnReference(fact);
    }

    /*
      Checks if the fact is stored in the local fact registry.
    */
    function localIsValid(bytes32 fact) external view returns (bool) {
        return internalIsValid(fact);
    }

    function isReferralActive() internal view returns (bool) {
        // solium-disable-next-line security/no-block-members
        return block.timestamp < referralExpirationTime;
    }

    /*
      Checks if a fact has been verified by the reference IFactRegistry.
    */
    function isValidOnReference(bytes32 fact) internal view returns (bool) {
        if (!isReferralActive()) {
            return false;
        }

        return referenceFactRegistry.isValid(fact);
    }
}
